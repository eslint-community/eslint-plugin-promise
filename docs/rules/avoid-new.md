# Disallow creating `new` promises outside of utility libs (use [util.promisify][] instead) (`promise/avoid-new`)

🚫 This rule is _disabled_ in the following configs: ✅ `flat/recommended`, ✅
`recommended`.

<!-- end auto-generated rule header -->

Avoid using `new Promise` in favour of utility libraries or
`Promise.resolve`/`reject`.

## Rule Details

Creating promises using `new Promise` can be used to promisify Node-style
callbacks. However, you can use Node's [`util.promisify`]() instead.

`new Promise` is also sometimes misused to wrap a value or error into a promise.
However, this can be done more concisely and clearly with `Promise.resolve` and
`Promise.reject`.

Examples of **incorrect** code for this rule:

```js
function promisifiedFn(arg) {
  return new Promise((resolve, reject) => {
    callbackStyleFn(arg, (error, result) =>
      error ? reject(error) : resolve(result),
    )
  })
}

new Promise((resolve, reject) => resolve(1))
new Promise((resolve, reject) => reject(new Error('oops')))
```

Examples of **correct** code for this rule:

```js
import util from 'util'
const promisifiedFn = util.promisify(callbackStyleFn)

Promise.resolve(1)
Promise.reject(new Error('oops'))
```

## When Not To Use It

If you are creating a utility library without [util.promisify]() or do not want
to be notified when using `new Promise`, you can safely disable this rule.

[util.promisify]: https://nodejs.org/api/util.html#util_util_promisify_original
