import { describe, expect, it } from 'vitest';
import { qrSvg } from '@/shared/lib/qrCode';
import { phoneQrUrl } from './passToast';

describe('phoneQrUrl', () => {
  it('sends a signed-in student to student pricing on the phone', () => {
    expect(phoneQrUrl(true, '/learn/1/assignment')).toBe(
      'https://pseudocode-compiler.sherlemious.com/pricing?view=student&from=pass_toast_phone',
    );
  });

  it('sends a signed-out visitor to sign up, then back to the same page', () => {
    const url = new URL(phoneQrUrl(false, '/learn/1/assignment'));
    expect(url.pathname).toBe('/auth/signup');
    expect(url.searchParams.get('callbackUrl')).toBe('/learn/1/assignment');
    expect(url.searchParams.get('from')).toBe('phone_qr_signup');
  });

  it('never puts an off-site callback in the QR', () => {
    expect(new URL(phoneQrUrl(false, '//evil.com')).searchParams.get('callbackUrl')).toBe('/learn');
  });

  it('fits in a QR code for a typical lesson path', () => {
    expect(() => qrSvg(phoneQrUrl(false, '/learn/9618/records-and-pointers-practice'))).not.toThrow();
  });
});
