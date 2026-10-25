import { BRAND } from '@/shared/brand/brand';
import { SITE_URL } from '@/modules/auth/resend';

/** Paid without an account: the plan is on a new account; this email lets them into it. */
export interface ClaimEmailOptions {
  /** e.g. "May/June pass", "Starter plan". */
  planLabel: string;
  claimUrl: string;
  email: string;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function claimEmailHtml({ planLabel, claimUrl, email }: ClaimEmailOptions): string {
  const { ink, paper, red } = BRAND.colors;
  const plan = escapeHtml(planLabel);
  const address = escapeHtml(email);
  const signin = `${SITE_URL}/auth/signin?callbackUrl=%2Fwelcome`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your ${plan} is ready</title>
</head>
<body style="margin:0;padding:0;background:${ink};font-family:Georgia,'Times New Roman',serif;color:${ink};">
  <div style="display:none;max-height:0;overflow:hidden;">Set a password and your ${plan} is waiting.</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${ink};padding:36px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:20px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;padding-right:10px;"><img src="${SITE_URL}/favicon.png" width="28" height="28" alt="" style="display:block;border:0;" /></td>
            <td style="vertical-align:middle;"><span style="font-size:22px;font-style:italic;color:${paper};line-height:1;">Pseudocode</span><span style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${paper};opacity:0.55;padding-left:8px;">Compiler</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="background:${paper};">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="width:8px;background:${red};font-size:0;line-height:0;">&nbsp;</td>
            <td style="padding:32px 30px 32px 26px;">
              <p style="margin:0 0 14px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${ink};opacity:0.55;">Receipt &nbsp;&middot;&nbsp; [paid]</p>
              <p style="margin:0 0 12px;font-size:26px;font-style:italic;line-height:1.3;color:${ink};">Your ${plan} is ready.</p>
              <p style="margin:0 0 18px;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:${ink};opacity:0.8;">Thanks for buying. We made an account for <strong>${address}</strong> and put the plan on it. Set a password to sign in and start.</p>
              <table cellpadding="0" cellspacing="0"><tr><td style="background:${red};">
                <a href="${claimUrl}" style="display:inline-block;padding:12px 26px;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:${paper};text-decoration:none;">Set my password &rarr;</a>
              </td></tr></table>
              <p style="margin:18px 0 0;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.6;color:${ink};opacity:0.7;">Is this a Google address? You can skip the password and <a href="${signin}" style="color:${red};">continue with Google</a> instead.</p>
              <p style="margin:22px 0 0;font-size:16px;font-style:italic;color:${ink};">Good luck with Paper 2,<br />Abdelrahman</p>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-top:22px;text-align:center;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;line-height:1.6;color:${paper};opacity:0.4;">
          The link works for 7 days. After that, open the link again and ask for a new one.<br />
          <span style="font-family:'Courier New',Courier,monospace;">// paid. now practise.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function claimEmailText({ planLabel, claimUrl, email }: ClaimEmailOptions): string {
  return `Your ${planLabel} is ready.

Thanks for buying. We made an account for ${email} and put the plan on it. Set a password to sign in and start:
${claimUrl}

Is this a Google address? You can skip the password and continue with Google instead:
${SITE_URL}/auth/signin?callbackUrl=%2Fwelcome

The link works for 7 days. After that, open it again and ask for a new one.

Good luck with Paper 2,
Abdelrahman`;
}
