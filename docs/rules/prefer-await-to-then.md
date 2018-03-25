# Prefer `await` to `then()` for reading Promise values (prefer-await-to-then)

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
```
