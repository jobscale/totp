import { base32 } from '@jobscale/base32';

export class Totp {
  constructor() {
    this.totp = this;
    this.Totp = Totp;
  }

  convertToBuffer(who, encoding) {
    if (encoding === 'base32') return base32.decode(who);
    return ArrayBuffer.from(who, encoding);
  }

  async createHmacKey(secret, buf, algorithm = 'HMAC') {
    const loader = typeof require !== 'undefined' ? require : undefined;
    if (loader) {
      const crypto = loader('crypto');
      const hmac = crypto.createHmac('sha1', secret);
      hmac.update(buf);
      return Buffer.from(hmac.digest(), 'hex');
    }
    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: algorithm, hash: { name: 'SHA-1' } },
      false,
      ['sign', 'verify'],
    );
    return crypto.subtle.sign(algorithm, key, buf);
  }

  async digest(options) {
    const { secret } = options;
    const { counter } = options;
    const encoding = options.encoding || 'base32';
    const blob = this.convertToBuffer(secret, encoding);
    const buf = new Uint8Array(8);
    let tmp = counter;
    for (let i = 0; i < 8; i++) {
      buf[7 - i] = tmp & 0xff;
      tmp >>= 8;
    }
    const signature = await this.createHmacKey(blob, buf);
    return new Uint8Array(signature);
  }

  async hotp(options) {
    const digits = (options.digits ? options.digits : options.length) || 6;
    const digest = options.digest || await this.digest(options);
    const offset = digest[digest.length - 1] & 0xf;
    const code = (digest[offset] & 0x7f) << 24
      | (digest[offset + 1] & 0xff) << 16
      | (digest[offset + 2] & 0xff) << 8
      | (digest[offset + 3] & 0xff);
    const strCode = new Array(digits + 1).join('0') + code.toString(10);
    return strCode.slice(-digits);
  }

  async auth(options) {
    const opt = { ...options };
    if (!opt.counter) {
      const step = options.step || 30;
      const time = options.time ? (options.time * 1000) : Date.now();
      const epoch = options.epoch ? options.epoch * 1000 : 0;
      opt.counter = Math.floor((time - epoch) / step / 1000);
    }
    return this.hotp(opt);
  }

  async verify(options) {
    const opt = { ...options };
    const { code, window } = options;
    if (code === await this.auth(opt)) return true;
    if (!window) return false;
    if (!opt.step) opt.step = 30;
    for (let i = 1; i <= window; i++) {
      opt.time = Math.floor(Date.now() / 1000) + (opt.step * i);
      if (code === await this.auth(opt)) return true;
      opt.time = Math.floor(Date.now() / 1000) + (opt.step * -i);
      if (code === await this.auth(opt)) return true;
    }
    return false;
  }
}

export const totp = new Totp();
export default {
  Totp,
  totp,
};
