import type { Paddle } from '@paddle/paddle-node-sdk';
import * as repo from '@/modules/billing/repo';
import { getPaddleEnv } from './env';
import { BAND_SLUGS, TIER_TO_PLAN, tierSlugForPriceId } from './plan';
import { expiryForPurchase, isTeacherPlan, passForPriceId } from './passes';
import { planUpdateFromPaddle, type PaddleSubscriptionLike } from './subscriptionState';
import { isOtherSubscription, isStaleEvent } from './webhookEvents';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import { revalidatePremiumAccess } from '@/modules/billing/entitlements';
import { sendClaimEmail } from '@/modules/auth/accountClaim';
import { verifyPayForToken } from '@/modules/billing/parentPay';
import { logger } from '@/shared/lib/logger';

/**
 * What each verified Paddle webhook event does to the app. The route
 * (app/api/paddle/webhook) checks the signature and de-duplicates events,
 * then dispatches here; plan writes go through billing/repo.ts.
 */

export interface SubscriptionData extends PaddleSubscriptionLike {
  id: string;
  status: string;
  customerId: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

export interface TransactionData {
  id: string;
  status: string;
  origin?: string | null;
  customerId: string | null;
  customData?: Record<string, unknown> | null;
  currencyCode?: string | null;
  details?: { totals?: { total?: string | null } | null } | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

export async function applySubscription(data: SubscriptionData, paddle: Paddle, occurredAt: Date) {
  const { user, created } = await resolveOrCreateUser(data, paddle);
  if (!user) {
    logger.warn('Paddle webhook: no app user for subscription', {
      subscription_id: data.id,
      customer_id: data.customerId,
    });
    return;
  }
  // Ordering only means something within one subscription: a new purchase's
  // events may legitimately arrive after the old subscription's cancellation.
  if (user.paddleSubscriptionId === data.id && isStaleEvent(occurredAt, user.planUpdatedAt)) {
    logger.warn('Paddle webhook: skipped out-of-date subscription event', {
      user_id: user.id,
      subscription_id: data.id,
      status: data.status,
    });
    return;
  }

  const priceId = data.items?.[0]?.price?.id ?? '';
  const slug = await tierSlugForPriceId(priceId, getPaddleEnv());
  const mapped = slug ? TIER_TO_PLAN[slug] : undefined;
  const update = planUpdateFromPaddle(data, mapped);

  if (update.outcome === 'revoke') {
    if (isOtherSubscription(user.paddleSubscriptionId, data.id)) {
      logger.warn('Paddle webhook: ignored revoke of a subscription the user no longer uses', {
        user_id: user.id,
        subscription_id: data.id,
        status: data.status,
      });
      return;
    }
    await setPlan(user.id, {
      occurredAt,
      plan: 'FREE',
      planTier: null,
      subscriptionId: data.id,
      customerId: data.customerId,
    });
    await captureServerEvent(user.id, 'subscription_plan_revoked', {
      reason: data.status,
      paddle_env: getPaddleEnv(),
      subscription_id: data.id,
      // Person `plan` is what workflows filter on. The browser only sets it at
      // sign-in, which is before this webhook, so a buyer stays FREE forever.
      $set: { plan: 'FREE' },
      $unset: ['plan_tier'],
    });
    return;
  }

  if (update.outcome === 'unmapped') {
    logger.warn('Paddle webhook: unmapped price on subscription', { price_id: priceId, subscription_id: data.id });
    await linkPaddleIds(user.id, data);
    return;
  }

  await setPlan(user.id, {
    occurredAt,
    plan: update.plan,
    planTier: update.planTier,
    planExpiresAt: update.planExpiresAt,
    subscriptionId: data.id,
    customerId: data.customerId,
    // New band SKUs drop grandfathered unlimited/3×30 limits. Renewals of the
    // existing Starter/Pro prices omit this so `legacyCapacity` stays put.
    ...(BAND_SLUGS.has(update.planTier) ? { legacyCapacity: false } : {}),
  });
  const env = getPaddleEnv();
  if (update.outcome === 'scheduled_cancel' && update.planExpiresAt) {
    await captureServerEvent(user.id, 'subscription_cancel_scheduled', {
      plan: update.plan,
      plan_tier: update.planTier,
      price_id: priceId,
      paddle_env: env,
      subscription_id: data.id,
      status: data.status,
      effective_at: update.planExpiresAt.toISOString(),
    });
    return;
  }
  if (created && user.email) await sendClaimEmail(user.email, planLabel(update.plan));
  await captureServerEvent(user.id, 'subscription_plan_granted', {
    plan: update.plan,
    plan_tier: update.planTier,
    price_id: priceId,
    paddle_env: env,
    subscription_id: data.id,
    status: data.status,
    $set: { plan: update.plan, plan_tier: update.planTier },
  });
}

export async function downgrade(data: SubscriptionData, occurredAt: Date) {
  const user = await findLinkedUser(data);
  if (!user) {
    logger.warn('Paddle webhook: no app user to downgrade', { subscription_id: data.id });
    return;
  }
  // findLinkedUser falls back to the customer, which also matches a user who
  // has since moved to a new subscription: cancelling the old one mustn't
  // take away the new plan.
  if (isOtherSubscription(user.paddleSubscriptionId, data.id)) {
    logger.warn('Paddle webhook: ignored downgrade of a subscription the user no longer uses', {
      user_id: user.id,
      subscription_id: data.id,
      status: data.status,
    });
    return;
  }
  if (isStaleEvent(occurredAt, user.planUpdatedAt)) {
    logger.warn('Paddle webhook: skipped out-of-date downgrade', { user_id: user.id, subscription_id: data.id });
    return;
  }
  await setPlan(user.id, {
    occurredAt,
    plan: 'FREE',
    planTier: null,
    subscriptionId: data.id,
    customerId: data.customerId,
    legacyCapacity: false,
  });
  await captureServerEvent(user.id, 'subscription_plan_revoked', {
    reason: data.status,
    paddle_env: getPaddleEnv(),
    subscription_id: data.id,
    $set: { plan: 'FREE' },
    $unset: ['plan_tier'],
  });
}

/**
 * Student-only one-time pass. Ignored for teacher accounts (role or plan) and
 * for transactions that aren't a known pass price (subscription renewals).
 */
export async function applyPassPurchase(data: TransactionData, paddle: Paddle, occurredAt: Date) {
  const env = getPaddleEnv();
  let pass = null as ReturnType<typeof passForPriceId>;
  for (const item of data.items ?? []) {
    pass = passForPriceId(item.price?.id ?? '', env);
    if (pass) break;
  }
  if (!pass) return;

  // Paid from a parent link: the signed token names the student, whatever
  // email the payer used. Their Paddle customer is the payer's, so it is not
  // linked to the student (a parent may pay for two children).
  const payForId = verifyPayForToken(data.customData?.pay_for);
  const { user, created } = payForId
    ? { user: await repo.findBillingUserById(payForId), created: false }
    : await resolveOrCreateUser(data as unknown as SubscriptionData, paddle);
  if (!user) {
    logger.warn('Paddle webhook: no app user for pass transaction', {
      transaction_id: data.id,
      customer_id: data.customerId,
    });
    return;
  }
  if (user.role === 'TEACHER' || isTeacherPlan(user.plan)) {
    logger.warn('Paddle webhook: ignored student pass for a teacher', {
      user_id: user.id,
      role: user.role,
      plan: user.plan,
    });
    return;
  }

  await setPlan(user.id, {
    occurredAt,
    plan: 'STUDENT',
    planTier: pass.tier,
    planExpiresAt: expiryForPurchase(pass, {
      now: new Date(),
      existingExpiresAt: user.planExpiresAt,
    }),
    customerId: payForId ? null : data.customerId,
  });
  if (created && user.email) await sendClaimEmail(user.email, `${pass.label} pass`);
  await captureServerEvent(user.id, 'student_pass_granted', {
    pass_kind: pass.kind,
    plan_tier: pass.tier,
    paddle_env: env,
    transaction_id: data.id,
    paid_by: payForId ? 'parent_link' : 'self',
    $set: { plan: 'STUDENT', plan_tier: pass.tier },
  });
}

/**
 * A signed-in buyer opened checkout (Paddle creates the transaction when the
 * overlay loads). Captured here rather than only in the browser because ad
 * blockers hide some buyers from PostHog entirely; the "checkout not finished"
 * follow-up workflow triggers on it. Email and name are `$set` so that workflow
 * can reach someone PostHog never identified.
 */
export async function recordCheckoutOpened(data: TransactionData) {
  if (data.origin !== 'web') return;
  // A parent opened checkout from a student's link. Counted on the student,
  // without `$set`: the student's email must not drive the "checkout not
  // finished" follow-up for a checkout they didn't open.
  const payForId = verifyPayForToken(data.customData?.pay_for);
  if (payForId) {
    await captureServerEvent(payForId, 'parent_checkout_opened', {
      transaction_id: data.id,
      price_id: data.items?.[0]?.price?.id ?? '',
      currency: data.currencyCode ?? null,
      total: data.details?.totals?.total ?? null,
      paddle_env: getPaddleEnv(),
    });
    return;
  }
  const appUserId = readAppUserId(data as unknown as SubscriptionData);
  if (!appUserId) return;
  const user = await repo.findCheckoutContact(appUserId);
  if (!user?.email) return;

  const env = getPaddleEnv();
  const priceId = data.items?.[0]?.price?.id ?? '';
  const pass = passForPriceId(priceId, env);
  await captureServerEvent(user.id, 'checkout_opened', {
    transaction_id: data.id,
    price_id: priceId,
    tier: pass?.tier ?? (await tierSlugForPriceId(priceId, env)),
    sku_type: pass ? 'session_pass' : 'subscription',
    currency: data.currencyCode ?? null,
    total: data.details?.totals?.total ?? null,
    role: user.role,
    paddle_env: env,
    // Also on the event: a person PostHog has never seen may not have the
    // `$set` applied yet when the workflow reads it.
    email: user.email,
    name: user.name ?? null,
    $set: { email: user.email, ...(user.name ? { name: user.name } : {}) },
  });
}

/**
 * `resolveUser`, plus: a buyer who chose "pay without an account" (custom data
 * `guest: true`) and has no account on the email they paid with gets one, so
 * the plan always lands on a user. `created` tells the caller to send the
 * set-your-password email.
 */
async function resolveOrCreateUser(data: SubscriptionData, paddle: Paddle) {
  const user = await resolveUser(data, paddle);
  if (user || data.customData?.guest !== true) return { user, created: false };
  const payer = await lookupCustomer(paddle, data.customerId);
  if (!payer.email) return { user: null, created: false };
  const role = data.customData?.intended_role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
  const result = await repo.createBillingUserForPayer({ email: payer.email, name: payer.name, role });
  if (result.created) {
    await captureServerEvent(result.user.id, 'account_created_from_checkout', {
      role,
      paddle_env: getPaddleEnv(),
      email: payer.email,
      $set: { email: payer.email, role, ...(payer.name ? { name: payer.name } : {}) },
    });
  }
  return result;
}

function planLabel(plan: string): string {
  return plan === 'STUDENT' ? 'Student plan' : `${plan.charAt(0)}${plan.slice(1).toLowerCase()} plan`;
}

/**
 * Who this verified event belongs to.
 *
 * `customData.app_user_id` is set in the browser, so it is only a hint. An
 * already-linked Paddle customer wins. Otherwise the id is accepted only when
 * the Paddle customer's email is that account's email. A mismatched id must
 * not overwrite someone else's plan or customer link.
 */
async function resolveUser(data: SubscriptionData, paddle: Paddle) {
  if (data.customerId) {
    const byCustomer = await repo.findBillingUserByCustomer(data.customerId);
    if (byCustomer) return byCustomer;
  }

  const payerEmail = await lookupCustomerEmail(paddle, data.customerId);
  const appUserId = readAppUserId(data);
  if (appUserId) {
    const byId = await repo.findBillingUserById(appUserId);
    if (byId && emailsMatch(byId.email, payerEmail)) return byId;
    if (byId) {
      logger.warn('Paddle webhook: ignored custom data that does not match the payer', {
        app_user_id: appUserId,
        customer_id: data.customerId ?? null,
      });
    }
  }

  if (payerEmail) {
    const byEmail = await repo.findBillingUserByEmail(payerEmail);
    if (byEmail) return byEmail;
  }
  return null;
}

async function lookupCustomerEmail(paddle: Paddle, customerId: string | null | undefined): Promise<string | null> {
  return (await lookupCustomer(paddle, customerId)).email;
}

async function lookupCustomer(
  paddle: Paddle,
  customerId: string | null | undefined,
): Promise<{ email: string | null; name: string | null }> {
  if (!customerId) return { email: null, name: null };
  try {
    const customer = await paddle.customers.get(customerId);
    return {
      email: customer?.email?.trim().toLowerCase() || null,
      name: customer?.name?.trim().slice(0, 60) || null,
    };
  } catch (err) {
    logger.error('Paddle webhook: customer email lookup failed', { error: String(err) });
    return { email: null, name: null };
  }
}

function emailsMatch(accountEmail: string | null, payerEmail: string | null): boolean {
  return Boolean(accountEmail && payerEmail && accountEmail.toLowerCase() === payerEmail);
}

/** A cancel or pause only affects the account already tied to that subscription or customer. */
async function findLinkedUser(data: SubscriptionData) {
  if (data.id) {
    const bySub = await repo.findBillingUserBySubscription(data.id);
    if (bySub) return bySub;
  }
  if (data.customerId) {
    const byCustomer = await repo.findBillingUserByCustomer(data.customerId);
    if (byCustomer) return byCustomer;
  }
  return null;
}

function readAppUserId(data: SubscriptionData): string | null {
  const raw = data.customData?.app_user_id;
  return typeof raw === 'string' && raw.length > 0 ? raw : null;
}

async function setPlan(userId: string, opts: Parameters<typeof repo.setPlan>[1]) {
  await repo.setPlan(userId, opts);
  revalidatePremiumAccess(userId);
}

async function linkPaddleIds(userId: string, data: SubscriptionData) {
  await repo.linkPaddleIds(userId, { subscriptionId: data.id, customerId: data.customerId });
}
