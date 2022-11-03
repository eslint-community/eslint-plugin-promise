# Enforce consistent param names and ordering when creating new promises (`promise/param-names`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Enforce standard parameter names for Promise constructors

#### Valid

```js
new Promise(function (resolve) { ... })
new Promise(function (resolve, reject) { ... })
new Promise(function (_resolve, _reject) { ... }) // Unused marker for parameters are allowed
```

#### Invalid

```js
new Promise(function (reject, resolve) { ... }) // incorrect order
new Promise(function (ok, fail) { ... }) // non-standard parameter names
new Promise(function (_, reject) { ... }) // a simple underscore is not allowed
```

Ensures that `new Promise()` is instantiated with the parameter names
`resolve, reject` to avoid confusion with order such as `reject, resolve`. The
Promise constructor uses the
[RevealingConstructor pattern](https://blog.domenic.me/the-revealing-constructor-pattern/).
Using the same parameter names as the language specification makes code more
uniform and easier to understand.

#### Options

##### `resolvePattern`

You can pass a `{ resolvePattern: "^_?resolve$" }` as an option to this rule to
the first argument name pattern that the rule allows. Default is
`"^_?resolve$"`.

##### `rejectPattern`

You can pass a `{ rejectPattern: "^_?reject$" }` as an option to this rule to
the second argument name pattern that the rule allows. Default is
`"^_?reject$"`.
