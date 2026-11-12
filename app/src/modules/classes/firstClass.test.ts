import { beforeEach, describe, expect, it, vi } from 'vitest';

const { repo, entitlements, capture } = vi.hoisted(() => ({
  repo: { countAllClasses: vi.fn(), countActiveClasses: vi.fn(), createClass: vi.fn() },
  entitlements: { getEntitlements: vi.fn() },
  capture: vi.fn(),
}));

vi.mock('@/shared/db', () => ({ prisma: {} }));
vi.mock('./repo', () => repo);
vi.mock('@/modules/exams/repo', () => ({ createExam: vi.fn(), findOwnedExam: vi.fn() }));
vi.mock('@/shared/lib/catalogCache', () => ({ existingCatalogQuestionIds: vi.fn(), getQuestionCatalog: vi.fn() }));
vi.mock('@/modules/billing/entitlements', () => ({
  getEntitlements: entitlements.getEntitlements,
  getPremiumAccess: vi.fn(),
  isAtStudentCap: vi.fn(),
  limitsForUser: vi.fn(),
  revalidatePremiumAccess: vi.fn(),
}));
vi.mock('@/modules/billing/featureFlags', () => ({ PREMIUM_GATING_ENABLED: false }));
vi.mock('@/modules/auth/userRepo', () => ({ promoteToTeacher: vi.fn() }));
vi.mock('@/modules/telemetry/serverCapture', () => ({ captureServerEvent: capture }));

import { ensureFirstClass, FIRST_CLASS_NAME } from './service';

const teacher = { id: 't1', role: 'TEACHER' };

beforeEach(() => {
  vi.clearAllMocks();
  entitlements.getEntitlements.mockResolvedValue({ limits: { maxClasses: 1 } });
  repo.countActiveClasses.mockResolvedValue(0);
  repo.createClass.mockResolvedValue({ id: 'c1' });
});

describe('ensureFirstClass', () => {
  it('makes a class for a teacher who has never had one', async () => {
    repo.countAllClasses.mockResolvedValue(0);
    await expect(ensureFirstClass(teacher)).resolves.toBe('c1');
    expect(repo.createClass).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 't1', name: FIRST_CLASS_NAME }));
    expect(capture).toHaveBeenCalledWith('t1', 'class_auto_created', { class_id: 'c1' });
  });

  it('never recreates one, even when the only class is archived', async () => {
    repo.countAllClasses.mockResolvedValue(1);
    await expect(ensureFirstClass(teacher)).resolves.toBeNull();
    expect(repo.createClass).not.toHaveBeenCalled();
  });

  it('leaves students and admins alone', async () => {
    repo.countAllClasses.mockResolvedValue(0);
    await expect(ensureFirstClass({ id: 's1', role: 'STUDENT' })).resolves.toBeNull();
    await expect(ensureFirstClass({ id: 'a1', role: 'ADMIN' })).resolves.toBeNull();
    expect(repo.createClass).not.toHaveBeenCalled();
  });

  it('falls back to the create form when the plan limit says no', async () => {
    repo.countAllClasses.mockResolvedValue(0);
    entitlements.getEntitlements.mockResolvedValue({ limits: { maxClasses: 0 } });
    await expect(ensureFirstClass(teacher)).resolves.toBeNull();
  });
});
