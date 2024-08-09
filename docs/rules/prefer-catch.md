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
