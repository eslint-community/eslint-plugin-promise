# Disallow calling `cb()` inside of a `then()` (use [nodeify][] instead) (`promise/no-callback-in-promise`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

As a general rule, callbacks should never be directly invoked inside a
[Promise.prototype.then()] or [Promise.prototype.catch()] method. That's because
your callback may be unintentionally be invoked twice. It also can be confusing
to mix paradigms.

Take the following example:

```js
function callback(err, data) {
  console.log('Callback got called with:', err, data)
  throw new Error('My error')
}

// note: passing `err.message` for demo purposes, normally you would pass `err`
Promise.resolve()
  .then(() => callback(null, 'data'))
  .catch((err) => callback(err.message, null))
```

If you run this example, your output will look like the following:

```
Callback got called with: null data
Callback got called with: My error null
```

**How to fix it?**

Ensure that your callback invocations are wrapped by a deferred execution
function such as:

- [setImmediate()] or [process.nextTick()]: for Node.js.
- [setTimeout()]: for Browsers and Node.js.

```js
// node.js
Promise.resolve()
  .then(() => setImmediate(() => callback(null, 'data')))
  .catch((err) => setImmediate(() => callback(err.message, null)))

// node.js and browsers
Promise.resolve()
  .then(() => setTimeout(() => callback(null, 'data'), 0))
  .catch((err) => setTimeout(() => callback(err.message, null), 0))
```

Your output will now look like the following:

```js
Callback got called with: null data
```

Finally, if your callbacks have a Node.js signature (i.e.
`callback(err, data)`), consider using [util.promisify] for promisifying your
callback code instead of combining the approaches.

[util.promisify]:
  https://nodejs.org/dist/latest/docs/api/util.html#utilpromisifyoriginal
[promise.prototype.then()]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
[promise.prototype.catch()]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
[setimmediate()]:
  https://nodejs.org/docs/latest-v14.x/api/timers.html#timers_setimmediate_callback_args
[process.nexttick()]:
  https://nodejs.org/docs/latest-v14.x/api/process.html#process_process_nexttick_callback_args
[settimeout()]:
  https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout

## Options

### `exceptions`

String list of callback function names to exempt.

[nodeify]: https://www.npmjs.com/package/nodeify
