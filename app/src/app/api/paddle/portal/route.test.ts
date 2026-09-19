import { beforeEach, describe, expect, it, vi } from 'vitest';

const { auth, findUnique, getPaddleServer, createPortal } = vi.hoisted(() => ({
  auth: vi.fn(),
  findUnique: vi.fn(),
  getPaddleServer: vi.fn(),
  createPortal: vi.fn(),
}));

vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/shared/db', () => ({
  prisma: { user: { findUnique } },
}));
vi.mock('@/modules/billing/paddle/server', () => ({ getPaddleServer }));
vi.mock('@/shared/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import { GET } from './route';

const OVERVIEW = 'https://customer-portal.paddle.com/cpl_live?action=overview&token=pga_x';
const FALLBACK = 'https://customer-portal.paddle.com/cpl_fallback';

function paddle() {
  return { customerPortalSessions: { create: createPortal } };
}

describe('GET /api/paddle/portal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.PADDLE_CUSTOMER_PORTAL_URL;
    auth.mockResolvedValue({ user: { id: 'u1' } });
    findUnique.mockResolvedValue({
      paddleCustomerId: 'ctm_01abc',
      paddleSubscriptionId: 'sub_01xyz',
    });
    getPaddleServer.mockReturnValue(paddle());
    createPortal.mockResolvedValue({ urls: { general: { overview: OVERVIEW } } });
  });

  it('sends signed-out users to sign-in', async () => {
    auth.mockResolvedValue(null);
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://app.example/auth/signin');
    expect(createPortal).not.toHaveBeenCalled();
  });

  it('sends users without a Paddle customer to pricing', async () => {
    findUnique.mockResolvedValue({ paddleCustomerId: null, paddleSubscriptionId: null });
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(res.headers.get('location')).toBe('https://app.example/pricing');
    expect(createPortal).not.toHaveBeenCalled();
  });

  it('redirects to the authenticated overview URL', async () => {
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(res.headers.get('location')).toBe(OVERVIEW);
    expect(createPortal).toHaveBeenCalledWith('ctm_01abc', ['sub_01xyz']);
  });

  it('falls back to an overview session when the subscription deep-link fails', async () => {
    createPortal
      .mockRejectedValueOnce({ code: 'invalid_request', detail: 'Invalid request.' })
      .mockResolvedValueOnce({ urls: { general: { overview: OVERVIEW } } });
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(res.headers.get('location')).toBe(OVERVIEW);
    expect(createPortal).toHaveBeenCalledTimes(2);
    expect(createPortal).toHaveBeenLastCalledWith('ctm_01abc', []);
  });

  it('does not retry the overview session when the key is forbidden', async () => {
    createPortal.mockRejectedValue({
      code: 'forbidden',
      detail: 'not authorized to create customer-portal-session',
      type: 'request_error',
    });
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(createPortal).toHaveBeenCalledTimes(1);
    expect(res.headers.get('location')).toBe('https://app.example/pricing?portal=error');
  });

  it('does not leak Paddle error details in the redirect', async () => {
    createPortal.mockRejectedValue({
      code: 'forbidden',
      detail: 'not authorized to create customer-portal-session',
    });
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    const location = res.headers.get('location') ?? '';
    expect(location).not.toContain('reason');
    expect(location).not.toContain('forbidden');
    expect(location).not.toContain('customer-portal-session');
  });

  it('uses the public portal URL when session creation is forbidden', async () => {
    process.env.PADDLE_CUSTOMER_PORTAL_URL = FALLBACK;
    createPortal.mockRejectedValue({ code: 'forbidden', detail: 'not authorized' });
    const res = await GET(new Request('https://app.example/api/paddle/portal'));
    expect(res.headers.get('location')).toBe(FALLBACK);
  });
});
