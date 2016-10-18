'use strict'

var rule = require('../rules/prefer-await-to-callbacks')
var RuleTester = require('eslint').RuleTester
var message = 'Avoid callbacks. Prefer Async/Await.'
var parserOptions = { ecmaVersion: 8 }
var ruleTester = new RuleTester()

ruleTester.run('prefer-await-to-callbacks', rule, {
  valid: [
    { code: 'async function hi() { await thing().catch(err => console.log(err)) }', parserOptions: parserOptions },
    { code: 'async function hi() { await thing().then() }', parserOptions: parserOptions },
    { code: 'async function hi() { await thing().catch() }', parserOptions: parserOptions }
  ],

  invalid: [
    {
      code: 'heart(function(err) {})',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'heart(err => {})',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'heart("ball", function(err) {})',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'function getData(id, callback) {}',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'const getData = (cb) => {}',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'var x = function (x, cb) {}',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'cb()',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    },
    {
      code: 'callback()',
      parserOptions: parserOptions,
      errors: [ { message: message } ]
    }
  ]
})
