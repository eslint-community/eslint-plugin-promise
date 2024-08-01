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
    },
    {
      code: 'hey.then(null, fn2)',
      errors: [{ message }],
    },
    {
      code: 'function foo() { hey.then(x => {}, () => {}) }',
      errors: [{ message }],
    },
    {
      code: `
        function foo() {
          hey.then(function() { }, function() {}).then(fn1, fn2)
        }
      `,
      errors: [{ message }, { message }],
    },
  ],
})
