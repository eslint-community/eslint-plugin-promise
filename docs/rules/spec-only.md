# Disallow use of non-standard Promise static methods (`promise/spec-only`)

<!-- end auto-generated rule header -->

It may become difficult to migrate code depending on non-standard Promise
extensions. This rule reports any such method usage.

## Valid

```js
const x = Promise.resolve('good')
```

## Invalid

```js
const x = Promise.done('bad')
```

## Options

### `allowedMethods`

An array of allowed non-standard methods. Defaults to an empty array.
