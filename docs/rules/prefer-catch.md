# Prefer `catch` to `then(a, b)`/`then(null, b)` for handling errors (`promise/prefer-catch`)

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

A `then` call with two arguments can make it more difficult to recognize that a
catch error handler is present and can be less clear as to the order in which
errors will be handled.

## Rule Details

The second argument of a `then` call may be thought to handle any errors in the
first argument, but it will only handle errors earlier in the Promise chain.

Examples of **incorrect** code for this rule:

```js
prom.then(fn1).then(fn2)
prom.catch(handleErr).then(handle)
```

Examples of **incorrect** code for this rule:

```js
hey.then(fn1, fn2)
hey.then(null, fn2)
```

## Automatic Fixes

This rule can automatically replace `then(null, onRejected)` and
`then(undefined, onRejected)` with `catch(onRejected)` when `undefined`
statically resolves to the global value.

Calls with a fulfillment handler are reported without an automatic fix because
moving the rejection handler into a separate `catch` changes the behavior. For
example, `prom.catch(onRejected).then(onFulfilled)` also calls `onFulfilled`
when `onRejected` recovers from a rejection, whereas
`prom.then(onFulfilled, onRejected)` does not. Using
`prom.then(onFulfilled).catch(onRejected)` instead also catches errors thrown by
`onFulfilled`, which the original call does not catch. Review these calls
manually to choose the intended error-handling behavior.
