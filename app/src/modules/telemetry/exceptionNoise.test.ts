import { describe, expect, it } from 'vitest';
import { isNoiseException } from './exceptionNoise';

const exception = (value: string) => ({
  event: '$exception',
  properties: { $exception_list: [{ type: 'Error', value }] },
});

describe('isNoiseException', () => {
  it('drops the ResizeObserver browser warnings', () => {
    expect(isNoiseException(exception('ResizeObserver loop completed with undelivered notifications.'))).toBe(true);
    expect(isNoiseException(exception('ResizeObserver loop limit exceeded'))).toBe(true);
  });

  it("drops the Outlook link scanner's rejections", () => {
    expect(
      isNoiseException({
        event: '$exception',
        properties: {
          $exception_values: ['Non-Error promise rejection captured with value: Object Not Found Matching Id:3, MethodName:update, ParamCount:4'],
        },
      }),
    ).toBe(true);
  });

  it('keeps real crashes and other events', () => {
    expect(isNoiseException(exception("Cannot read properties of null (reading 'getItem')"))).toBe(false);
    expect(isNoiseException({ event: '$pageview', properties: {} })).toBe(false);
    expect(isNoiseException({ event: '$exception', properties: {} })).toBe(false);
    expect(isNoiseException(null)).toBe(false);
  });

  it('keeps a mixed event when one of its errors is real', () => {
    expect(
      isNoiseException({
        event: '$exception',
        properties: { $exception_list: [{ value: 'ResizeObserver loop limit exceeded' }, { value: 'ChunkLoadError' }] },
      }),
    ).toBe(false);
  });
});
