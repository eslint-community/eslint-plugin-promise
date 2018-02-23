# Disallow return statements in `finally()` (no-return-in-finally)

Disallow return statements inside a callback passed to `finally()`, since
nothing would consume what's returned.

#### Valid

```js
myPromise.finally(function(val) {
  console.log('value:', val)
})
```

#### Invalid

```js
myPromise.finally(function(val) {
  return val
})
```
