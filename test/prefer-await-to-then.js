'use strict'

var rule = require('../rules/prefer-await-to-then')
var RuleTester = require('eslint').RuleTester
var message = 'Prefer await to then().'
var parserOptions = { ecmaVersion: 8 }
var ruleTester = new RuleTester()
ruleTester.run('prefer-await-to-then', rule, {
  valid: [
    { code: 'async function hi() { await thing() }', parserOptions: parserOptions },
    { code: 'async function hi() { await thing().then() }', parserOptions: parserOptions },
    { code: 'async function hi() { await thing().catch() }', parserOptions: parserOptions }
  ],

  invalid: [
    {
      code: 'hey.then(x => {})',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'hey.then(function() { }).then()',
      parserOptions: parserOptions,
      errors: [ { message: message }, { message: message } ]
    },
    {
      code: 'hey.then(function() { }).then(x).catch()',
      parserOptions: parserOptions,
      errors: [ { message: message }, { message: message } ]
    },
    {
      code: 'async function a() { hey.then(function() { }).then(function() { }) }',
      parserOptions: parserOptions,
      errors: [ { message: message }, { message: message } ]
    }
  ]
})
