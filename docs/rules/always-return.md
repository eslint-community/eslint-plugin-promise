# Return inside each `then()` to create readable and reusable Promise chains (always-return)

Ensure that inside a `then()` you make sure to `return` a new promise or value.
See http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html (rule #5)
for more info on why that's a good idea.

We also allow someone to `throw` inside a `then()` which is essentially the same
as `return Promise.reject()`.

#### Valid

```js
myPromise.then((val) => val * 2));
myPromise.then(function(val) { return val * 2; });
myPromise.then(doSomething); // could be either
myPromise.then((b) => { if (b) { return "yes" } else { return "no" } });
```

#### Invalid

```js
myPromise.then(function(val) {})
myPromise.then(() => {
  doSomething()
})
myPromise.then(b => {
  if (b) {
    return 'yes'
  } else {
    forgotToReturn()
  }
})
```
