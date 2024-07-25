# Require returning inside each `then()` to create readable and reusable Promise chains (`promise/always-return`)

💼 This rule is enabled in the following configs: ✅ `flat/recommended`, ✅
`recommended`.

<!-- end auto-generated rule header -->

Ensure that inside a `then()` you make sure to `return` a new promise or value.
See http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html (rule #5)
for more info on why that's a good idea.

We also allow someone to `throw` inside a `then()` which is essentially the same
as `return Promise.reject()`.

#### Valid

```js
myPromise.then((val) => val * 2)
myPromise.then(function (val) {
  return val * 2
})
myPromise.then(doSomething) // could be either
myPromise.then((b) => {
  if (b) {
    return 'yes'
  } else {
    return 'no'
  }
})
```

#### Invalid

```js
myPromise.then(function (val) {})
myPromise.then(() => {
  doSomething()
})
myPromise.then((b) => {
  if (b) {
    return 'yes'
  } else {
    forgotToReturn()
  }
})
```

#### Options

##### `ignoreLastCallback`

You can pass an `{ ignoreLastCallback: true }` as an option to this rule so that
the last `then()` callback in a promise chain does not warn if it does not have
a `return`. Default is `false`.

```js
// OK
promise.then((x) => {
  console.log(x)
})
// OK
void promise.then((x) => {
  console.log(x)
})
// OK
await promise.then((x) => {
  console.log(x)
})

promise
  // NG
  .then((x) => {
    console.log(x)
  })
  // OK
  .then((x) => {
    console.log(x)
  })

// NG
const v = promise.then((x) => {
  console.log(x)
})
// NG
const v = await promise.then((x) => {
  console.log(x)
})
function foo() {
  // NG
  return promise.then((x) => {
    console.log(x)
  })
}
```

##### `ignoreAssignmentVariable`

You can pass an `{ ignoreAssignmentVariable: [] }` as an option to this rule
with a list of variable names so that the last `then()` callback in a promise
chain does not warn if it does an assignment to a global variable. Default is
`["globalThis"]`.

```js
/* eslint promise/always-return: ["error", { ignoreAssignmentVariable: ["globalThis"] }] */

// OK
promise.then((x) => {
  globalThis = x
})

promise.then((x) => {
  globalThis.x = x
})

// OK
promise.then((x) => {
  globalThis.x.y = x
})

// NG
promise.then((x) => {
  anyOtherVariable = x
})

// NG
promise.then((x) => {
  anyOtherVariable.x = x
})

// NG
promise.then((x) => {
  x()
})
```
