# Prefer `Promise.resolve(foo)` to `new Promise((resolve) => resolve(foo))` (`promise/prefer-promise-static-methods`)

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Using `new Promise()` for simple use cases is a common mistake when developers
first start working with promises. When `resolve` or `reject` is immediately
called in the promise executor, it's better to just use the static
`Promise.resolve()` or `Promise.reject()` methods. The static methods are
faster, more readable and less verbose.

#### Valid

```js
Promise.resolve(foo)
Promise.reject(bar)

new Promise((resolve) => setTimeout(resolve, 100))
new Promise((resolve, reject) => {
  if (foo) {
    resolve(bar)
  }
})
```

#### Invalid

```js
new Promise((resolve) => resolve(foo))
new Promise((resolve) => {
  resolve(foo)
})
// autofix to Promise.resolve(foo);

new Promise((_, reject) => reject(foo))
new Promise(function (_, reject) {
  reject(foo)
})
// autofix to Promise.reject(foo);
```
