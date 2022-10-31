# Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values (`promise/prefer-await-to-then`)

<!-- end auto-generated rule header -->

#### Valid

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
```

#### Invalid

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
  return myPromise.catch(errors)
}

function exampleFour() {
  return myPromise.finally(cleanup)
}
```
