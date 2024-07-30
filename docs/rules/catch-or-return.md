# Enforce the use of `catch()` on un-returned promises (`promise/catch-or-return`)

💼 This rule is enabled in the following configs: ✅ `flat/recommended`, ✅
`recommended`.

<!-- end auto-generated rule header -->

Ensure that each time a `then()` is applied to a promise, a `catch()` is applied
as well. Exceptions are made if you are returning that promise.

#### Valid

```js
myPromise.then(doSomething).catch(errors)
myPromise.then(doSomething).then(doSomethingElse).catch(errors)
function doSomethingElse() {
  return myPromise.then(doSomething)
}
```

#### Invalid

```js
myPromise.then(doSomething)
myPromise.then(doSomething, catchErrors) // catch() may be a little better
function doSomethingElse() {
  return myPromise.then(doSomething)
}
```

#### Options

##### `allowThen`

The second argument to `then()` can also be used to handle a promise rejection,
but it won't catch any errors from the first argument callback. Because of this,
this rule reports usage of `then()` with two arguments without `catch()` by
default.

However, you can use `{ allowThen: true }` to allow using `then()` with two
arguments instead of `catch()` to handle promise rejections.

Examples of **incorrect** code for the default `{ allowThen: false }` option:

```js
myPromise.then(doSomething, handleErrors)
myPromise.then(null, handleErrors)
```

Examples of **correct** code for the `{ allowThen: true }` option:

```js
myPromise.then(doSomething, handleErrors)
myPromise.then(null, handleErrors)
myPromise.then(doSomething).catch(handleErrors)
```

##### `allowThenStrict`

`allowThenStrict` is similar to `allowThen` but it only permits `then` when the
fulfillment handler is `null`. This option ensures that the final rejected
handler works like a `catch` and can handle any uncaught errors from the final
`then`.

Examples of **incorrect** code for the default `{ allowThenStrict: false }`
option:

```js
myPromise.then(doSomething, handleErrors)
myPromise.then(null, handleErrors)
```

Examples of **correct** code for the `{ allowThenStrict: true }` option:

```js
myPromise.then(null, handleErrors)
myPromise.then(doSomething).catch(handleErrors)
```

Examples of **incorrect** code for the `{ allowThenStrict: true }` option:

```js
myPromise.then(doSomething, handleErrors)
```

##### `allowFinally`

You can pass an `{ allowFinally: true }` as an option to this rule to allow for
`.finally(fn)` to be used after `catch()` at the end of the promise chain. This
is different from adding `'finally'` as a `terminationMethod` because it will
still require the Promise chain to be "caught" beforehand.

##### `terminationMethod`

You can pass a `{ terminationMethod: 'done' }` as an option to this rule to
require `done()` instead of `catch()` at the end of the promise chain. This is
useful for many non-standard Promise implementations.

You can also pass an array of methods such as
`{ terminationMethod: ['catch', 'asCallback', 'finally'] }`.

This will allow any of

```js
Promise.resolve(1)
  .then(() => {
    throw new Error('oops')
  })
  .catch(logerror)
Promise.resolve(1)
  .then(() => {
    throw new Error('oops')
  })
  .asCallback(cb)
Promise.resolve(1)
  .then(() => {
    throw new Error('oops')
  })
  .finally(cleanUp)
```
