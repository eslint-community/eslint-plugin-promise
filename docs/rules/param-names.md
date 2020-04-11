# Enforce consistent param names when creating new promises (param-names)

Enforce standard parameter names for Promise constructors

#### Valid

```js
new Promise(function (resolve) { ... })
new Promise(function (resolve, reject) { ... })
```

#### Invalid

```js
new Promise(function (reject, resolve) { ... }) // incorrect order
new Promise(function (ok, fail) { ... }) // non-standard parameter names
```

Ensures that `new Promise()` is instantiated with the parameter names
`resolve, reject` to avoid confusion with order such as `reject, resolve`. The
Promise constructor uses the
[RevealingConstructor pattern](https://blog.domenic.me/the-revealing-constructor-pattern/).
Using the same parameter names as the language specification makes code more
uniform and easier to understand.
