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
    'async function hi() { await thing().catch() }'
  ],

  invalid: [
    {
      code: 'hey.then(x => {})',
      errors: [{ message }]
    },
    {
      code: 'hey.then(function() { }).then()',
      errors: [{ message }, { message }]
    },
    {
      code: 'hey.then(function() { }).then(x).catch()',
      errors: [{ message }, { message }]
    },
    {
      code:
        'async function a() { hey.then(function() { }).then(function() { }) }',
      errors: [{ message }, { message }]
    }
  ]
})
