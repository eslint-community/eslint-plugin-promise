# Avoid nested `then()` or `catch()` statements (no-nesting)

#### Valid

```js
myPromise
  .then(doSomething)
  .then(doSomethingElse)
  .catch(errors)
```

#### Invalid

```js
myPromise.then(val =>
  doSomething(val).then(doSomethingElse)
)

myPromise.then(val =>
  doSomething(val).catch(errors)
)

myPromise.catch(err =>
  doSomething(err).then(doSomethingElse)
)

myPromise.catch(err =>
  doSomething(err).catch(errors)
)
```
