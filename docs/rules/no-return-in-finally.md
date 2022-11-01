# Disallow return statements in `finally()` (`promise/no-return-in-finally`)

✅ This rule will _warn_ in the `recommended` config.

<!-- end auto-generated rule header -->

Disallow return statements inside a callback passed to `finally()`, since
nothing would consume what's returned.

#### Valid

```js
myPromise.finally(function (val) {
  console.log('value:', val)
})
```

#### Invalid

```js
myPromise.finally(function (val) {
  return val
})
```
