'use strict'

const rule = require('../rules/prefer-await-to-then')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8
  }
})

const message = 'Prefer await to then().'

ruleTester.run('prefer-await-to-then', rule, {
  valid: [
    'async function hi() { await thing() }',
    'async function hi() { await thing().then() }',
    'async function hi() { await thing().catch() }',
    'a = async () => (await something())',
    'something().then(async () => await somethingElse())'
  ],

  invalid: [
    {
      code: 'function foo() { hey.then(x => {}) }',
      errors: [{ message }]
    },
    {
      code: 'function foo() { hey.then(function() { }).then() }',
      errors: [{ message }, { message }]
    },
    {
      code: 'function foo() { hey.then(function() { }).then(x).catch() }',
      errors: [{ message }, { message }]
    },
    {
      code:
        'async function a() { hey.then(function() { }).then(function() { }) }',
      errors: [{ message }, { message }]
    }
  ]
})
