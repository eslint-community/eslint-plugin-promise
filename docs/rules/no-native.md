# Require creating a `Promise` constructor before using it in an ES5 environment (`promise/no-native`)

🚫 This rule is _disabled_ in the following configs: ✅ `flat/recommended`, ✅
`recommended`.

<!-- end auto-generated rule header -->

Ensure that `Promise` is included fresh in each file instead of relying on the
existence of a native promise implementation. Helpful if you want to use
`bluebird` or if you don't intend to use an ES6 Promise shim.

#### Valid

```js
const Promise = require('bluebird')
const x = Promise.resolve('good')
```

#### Invalid

```js
const x = Promise.resolve('bad')
```
