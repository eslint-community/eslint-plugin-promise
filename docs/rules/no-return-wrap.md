# Avoid wrapping values in `Promise.resolve` or `Promise.reject` when not needed (no-return-wrap)

Ensure that inside a `then()` or a `catch()` we always `return` or `throw` a raw
value instead of wrapping in `Promise.resolve` or `Promise.reject`

#### Valid

```js
myPromise.then(function(val) {
  return val * 2
})
myPromise.then(function(val) {
  throw 'bad thing'
})
```

#### Invalid

```js
myPromise.then(function(val) {
  return Promise.resolve(val * 2)
})
myPromise.then(function(val) {
  return Promise.reject('bad thing')
})
```

#### Options

##### `allowReject`

Pass `{ allowReject: true }` as an option to this rule to permit wrapping
returned values with `Promise.reject`, such as when you would use it as another
way to reject the promise.
