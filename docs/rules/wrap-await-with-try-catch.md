# Wrap awaits with try/catch blocks (wrap-await-with-try-catch)

## Rule Details

This rule is aimed at flagging awaits where they are not checked for possible rejections.

Examples for **incorrect** code for this rule:

```js
await doSomething()
```

```js
try {
    ...
}
catch (ex) {
    await doSomething();
}
```

```js
try {
    (async function someFn(){
        await doSomething();
    })();
}
catch (ex) {
    //...
}
```

Examples for **correct** code for this rule:

```js
try {
    await doSomething();
}
catch (ex) {
    //...
}
```

```js
try {
    //...
}
catch (ex0) {
    try {
        await doSomething();
    }
    catch (ex1) {
        //...
    }
}
```

```js
try {
    (async function someFn(){
        try {
            await doSomething();
        }
        catch (exInner) {
        //...
        }
    })();
}
catch (ex) {
    //...
}
```

## When Not To Use It

If you handle awaits with a different error checking mechanism, you can disable this rule.
