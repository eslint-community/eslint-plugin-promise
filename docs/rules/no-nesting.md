# Disallow nested `then()` or `catch()` statements (`promise/no-nesting`)

✅ This rule will _warn_ in the `recommended` config.

<!-- end auto-generated rule header -->

#### Valid

```js
myPromise.then(doSomething).then(doSomethingElse).catch(errors)
```

#### Invalid

```js
myPromise.then((val) => doSomething(val).then(doSomethingElse))

myPromise.then((val) => doSomething(val).catch(errors))

myPromise.catch((err) => doSomething(err).then(doSomethingElse))

myPromise.catch((err) => doSomething(err).catch(errors))
```
