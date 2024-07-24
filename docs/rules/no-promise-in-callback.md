# Disallow using promises inside of callbacks (`promise/no-promise-in-callback`)

⚠️ This rule _warns_ in the following configs: ✅ `flat/recommended`, ✅
`recommended`.

<!-- end auto-generated rule header -->

Discourages the use of promises inside callbacks.

## Rule Details

Promises and callbacks are different ways to handle asynchronous code and should
not be mixed.

Examples of **incorrect** code for this rule:

```js
doSomething((err, val) => {
  if (err) console.error(err)
  else doSomethingElse(val).then(console.log)
})
```

Examples of **correct** code for this rule:

```js
promisify(doSomething)()
  .then(doSomethingElse)
  .then(console.log)
  .catch(console.error)
```

## When Not To Use It

If you do not want to be notified when using promises inside of callbacks, you
can safely disable this rule.
