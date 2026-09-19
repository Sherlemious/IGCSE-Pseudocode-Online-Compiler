import { describe, expect, it } from 'vitest';
import { isPaddleForbidden, paddleErrorAttrs, safeCustomerPortalFallbackUrl } from './portal';

describe('paddleErrorAttrs', () => {
  it('reads Paddle ApiError fields', () => {
    expect(
      paddleErrorAttrs({
        code: 'forbidden',
        detail: 'not authorized to create customer-portal-session',
        type: 'request_error',
      }),
    ).toEqual({
      code: 'forbidden',
      detail: 'not authorized to create customer-portal-session',
      type: 'request_error',
    });
  });

  it('falls back to message when detail is missing', () => {
    expect(paddleErrorAttrs({ message: 'network down' })).toEqual({ detail: 'network down' });
  });
});

describe('isPaddleForbidden', () => {
  it('is true only for forbidden', () => {
    expect(isPaddleForbidden({ code: 'forbidden' })).toBe(true);
    expect(isPaddleForbidden({ code: 'not_found' })).toBe(false);
    expect(isPaddleForbidden(new Error('nope'))).toBe(false);
  });
});

describe('safeCustomerPortalFallbackUrl', () => {
  it('accepts the live and sandbox Paddle portal hosts over https', () => {
    expect(safeCustomerPortalFallbackUrl('https://customer-portal.paddle.com/cpl_abc')).toBe(
      'https://customer-portal.paddle.com/cpl_abc',
    );
    expect(
      safeCustomerPortalFallbackUrl('https://sandbox-customer-portal.paddle.com/cpl_abc'),
    ).toBe('https://sandbox-customer-portal.paddle.com/cpl_abc');
  });

  it('rejects open redirects and empty values', () => {
    expect(safeCustomerPortalFallbackUrl(undefined)).toBeNull();
    expect(safeCustomerPortalFallbackUrl('')).toBeNull();
    expect(safeCustomerPortalFallbackUrl('http://customer-portal.paddle.com/cpl_abc')).toBeNull();
    expect(safeCustomerPortalFallbackUrl('https://evil.example/phish')).toBeNull();
    expect(safeCustomerPortalFallbackUrl('not a url')).toBeNull();
  });
});
