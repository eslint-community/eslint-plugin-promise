'use strict'

const rule = require('../rules/prefer-catch')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8,
  },
})

const message = 'Prefer `catch` to `then(a, b)`/`then(null, b)`.'

ruleTester.run('prefer-catch', rule, {
  valid: [
    'prom.then()',
    'prom.then(fn)',
    'prom.then(fn1).then(fn2)',
    'prom.then(() => {})',
    'prom.then(function () {})',
    'prom.catch()',
    'prom.catch(handleErr).then(handle)',
    'prom.catch(handleErr)',
  ],

  invalid: [
    {
      code: 'hey.then(fn1, fn2)',
      errors: [{ message }],
      output: 'hey.catch(fn2).then(fn1)',
    },
    {
      code: 'hey.then(fn1, (fn2))',
      errors: [{ message }],
      output: 'hey.catch(fn2).then(fn1)',
    },
    {
      code: 'hey.then(null, fn2)',
      errors: [{ message }],
      output: 'hey.catch(fn2)',
    },
    {
      code: 'hey.then(undefined, fn2)',
      errors: [{ message }],
      output: 'hey.catch(fn2)',
    },
    {
      code: 'function foo() { hey.then(x => {}, () => {}) }',
      errors: [{ message }],
      output: 'function foo() { hey.catch(() => {}).then(x => {}) }',
    },
    {
      code: `
        function foo() {
          hey.then(function a() { }, function b() {}).then(fn1, fn2)
        }
      `,
      errors: [{ message }, { message }],
      output: `
        function foo() {
          hey.catch(function b() {}).then(function a() { }).catch(fn2).then(fn1)
        }
      `,
    },
  ],
})
