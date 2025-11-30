import { describe, jest } from '@jest/globals';
import { totp } from '../index.js';

const list = [
  'JSXJPX6EY4BMPXI',
  'JSXJPX6EY4BMPXIRS',
  'JSXJPX6EY4BMPXIRSSR',
  'JSXJPX6EY4BMPXIRSSR74',
];

describe('Totp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  list.forEach((secret, index) => {
    describe(`parameter variations ${index}`, () => {
      describe('auth', () => {
        it('should generate a token for a given secret', async () => {
          const token = await totp.auth({ secret, time: 1600000000 });
          expect(token).toHaveLength(6);
          expect(token).toMatch(/^\d+$/);
        });

        it('should generate different tokens for different times', async () => {
          const token1 = await totp.auth({ secret, time: 1600000000 });
          const token2 = await totp.auth({ secret, time: 1600000030 });
          expect(token1).not.toBe(token2);
        });

        it('should use current time if time is not provided', async () => {
          jest.setSystemTime(1600000000 * 1000);
          const token1 = await totp.auth({ secret });
          const token2 = await totp.auth({ secret, time: 1600000000 });
          expect(token1).toBe(token2);
        });
      });

      describe('verify', () => {
        it('should verify a valid token', async () => {
          const time = 1600000000;
          const token = await totp.auth({ secret, time });
          const isValid = await totp.verify({ secret, code: token, time });
          expect(isValid).toBe(true);
        });

        it('should reject an invalid token', async () => {
          const time = 1600000000;
          const isValid = await totp.verify({ secret, code: '000000', time });
          expect(isValid).toBe(false);
        });

        it('should verify a token within the window', async () => {
          const time = 1600000000;
          const token = await totp.auth({ secret, time });

          // Test previous window
          const isValidPrev = await totp.verify({
            secret,
            code: token,
            time: time + 30,
            window: 1,
          });
          expect(isValidPrev).toBe(true);

          // Test next window
          const isValidNext = await totp.verify({
            secret,
            code: token,
            time: time - 30,
            window: 1,
          });
          expect(isValidNext).toBe(true);
        });

        it('should reject a token outside the window', async () => {
          const time = 1600000000;
          const token = await totp.auth({ secret, time });

          const isValid = await totp.verify({
            secret,
            code: token,
            time: time + 60,
            window: 1,
          });
          expect(isValid).toBe(false);
        });
      });

      describe('hotp', () => {
        it('should generate HOTP code', async () => {
          const counter = 0;
          const code = await totp.hotp({ secret, counter });
          expect(code).toHaveLength(6);
        });
      });
    });
  });
});
