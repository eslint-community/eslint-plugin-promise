# Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values (prefer-await-to-then)

`async` and `await` can be clearer and easier to understand than using `then()`.

## Rule Details

ES2017's `async` and `await` can be easier and clearer to deal with promises
than using `then()` and `catch()`.

Examples of **incorrect** code for this rule:

```js
function example() {
  return myPromise.then(doSomethingSync).then(doSomethingElseAsync)
}

function exampleTwo() {
  return myPromise
    .then(doSomethingSync)
    .then(doSomethingElseAsync)
    .catch(errors)
}


function exampleThree() {
  return myPromise
    .catch(errors)
}

function exampleFour() {
  return myPromise
    .finally(cleanup)
}
```

Examples of **correct** code for this rule:

```js
async function example() {
  let val = await myPromise()
  val = doSomethingSync(val)
  return doSomethingElseAsync(val)
}

async function exampleTwo() {
  try {
    let val = await myPromise()
    val = doSomethingSync(val)
    return await doSomethingElseAsync(val)
  } catch (err) {
    errors(err)
  }
}

async function exampleThree() {
  try {
    await myPromise
  } catch(error) {
    errors(error)
  }
}

async function exampleFour() {
  try {
    await myPromise
  } finally {
    cleanup()
  }
}
```

## When Not To Use It

If you are not targeting an ES2017 or above environment and do not have a
shim for `async`/`await`, you should disable this rule.

## Further Reading

- [Making asynchronous programming easier with async and await on MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
