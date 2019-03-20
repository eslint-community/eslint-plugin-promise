# Enforces the use of `catch()` on un-returned promises (catch-or-return)

Ensure that each time a `then()` is applied to a promise, a `catch()` is applied
as well. Exceptions are made if you are returning that promise.

#### Valid

```js
myPromise.then(doSomething).catch(errors)
myPromise
  .then(doSomething)
  .then(doSomethingElse)
  .catch(errors)
function doSomethingElse() {
  return myPromise.then(doSomething)
}
```

#### Invalid

```js
myPromise.then(doSomething)
myPromise.then(doSomething, catchErrors) // catch() may be a little better
function doSomethingElse() {
  myPromise.then(doSomething)
}
```

#### Options

##### `allowThen`

You can pass an `{ allowThen: true }` as an option to this rule to allow for
`.then(null, fn)` to be used instead of `catch()` at the end of the promise
chain.

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
