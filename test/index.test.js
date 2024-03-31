const { TOTP } = require('..');

const list = [
  'JSXJPX6EY4BMPXI',
  'JSXJPX6EY4BMPXIRS',
  'JSXJPX6EY4BMPXIRSSR',
  'JSXJPX6EY4BMPXIRSSR74',
];

describe('test base32', () => {
  for (const [index, value] of list.entries()) {
    describe(`test step ${index}`, () => {
      it(`toBe step prompt window ${index}`, async () => {
        const totp = new TOTP();
        const code = await totp.auth({
          secret: value,
        });
        const res = await totp.verify({
          code,
          secret: value,
          window: 1,
        });
        expect(res).toBe(true);
      });

      it(`toBe step 1 window ${index}`, async () => {
        const totp = new TOTP();
        const code = await totp.auth({
          secret: value,
          time: Math.floor(Date.now() / 1000) + 30,
        });
        const res = await totp.verify({
          code,
          secret: value,
          window: 1,
        });
        expect(res).toBe(true);
      });

      it(`toBe step 2 window ${index}`, async () => {
        const totp = new TOTP();
        const code = await totp.auth({
          secret: value,
          time: Math.floor(Date.now() / 1000) + 60,
        });
        const res = await totp.verify({
          code,
          secret: value,
          window: 2,
        });
        expect(res).toBe(true);
      });

      it(`toBe step 3 window ${index}`, async () => {
        const totp = new TOTP();
        const code = await totp.auth({
          secret: value,
          time: Math.floor(Date.now() / 1000) + 90,
        });
        const res = await totp.verify({
          code,
          secret: value,
          window: 3,
        });
        expect(res).toBe(true);
      });
    });
  }
});
