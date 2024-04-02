# totp

## Installation

```
npm i @jobscale/totp
```

## Examples

```
const { TOTP } = require('@jobscale/totp);

const logger = console;
const totp = new TOTP();

const value = 'JSXJPX6EY4BMPXIRSSR74';

const main = async () => {
  const code = await totp.auth({
    secret: value,
  });
  const res = await totp.verify({
    code,
    secret: value,
    window: 1,
  });
  logger.info({ res });
};

main();
```

## Demo

[https://totp.cdn.jsx.jp](https://totp.cdn.jsx.jp)

## Lint

```
npm run lint --if-present
```

## Test

```
npm test
```
