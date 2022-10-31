# Disallow creating new promises with paths that resolve multiple times (`promise/no-multiple-resolved`)

<!-- end auto-generated rule header -->

This rule warns of paths that resolve multiple times in executor functions that
Promise constructors.

#### Valid

```js
new Promise((resolve, reject) => {
  fn((error, value) => {
    if (error) {
      reject(error)
    } else {
      resolve(value)
    }
  })
})
```

#### Invalid

```js
new Promise((resolve, reject) => {
  fn((error, value) => {
    if (error) {
      reject(error)
    }

    resolve(value) // Both `reject` and `resolve` may be called.
  })
})
```
