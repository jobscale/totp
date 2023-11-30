const { TOTP } = require('..');

const secret = [
  'JSXJPX6EY4BMPXI',
  'JSXJPX6EY4BMPXIRS',
  'JSXJPX6EY4BMPXIRSSR',
  'JSXJPX6EY4BMPXIRSSR74',
];

describe('test base32', () => {
  describe('step1', () => {
    it('toBe prompt', async () => {
      const totp = new TOTP();
      const code = await totp.totp({
        secret: secret[0],
      });
      const res = await totp.verify({
        code,
        secret: secret[0],
        window: 1,
      });
      expect(res).toBe(true);
    });
  });

  describe('step2', () => {
    it('toBe prompt', async () => {
      const totp = new TOTP();
      const code = await totp.totp({
        secret: secret[1],
        time: Math.floor(Date.now() / 1000) + 30,
      });
      const res = await totp.verify({
        code,
        secret: secret[1],
        window: 1,
      });
      expect(res).toBe(true);
    });
  });

  describe('step3', () => {
    it('toBe prompt', async () => {
      const totp = new TOTP();
      const code = await totp.totp({
        secret: secret[2],
        time: Math.floor(Date.now() / 1000) + 60,
      });
      const res = await totp.verify({
        code,
        secret: secret[2],
        window: 2,
      });
      expect(res).toBe(true);
    });
  });

  describe('step4', () => {
    it('toBe prompt', async () => {
      const totp = new TOTP();
      const code = await totp.totp({
        secret: secret[3],
        time: Math.floor(Date.now() / 1000) + 90,
      });
      const res = await totp.verify({
        code,
        secret: secret[3],
        window: 3,
      });
      expect(res).toBe(true);
    });
  });
});
