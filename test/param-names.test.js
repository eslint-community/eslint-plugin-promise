'use strict'

const rule = require('../rules/param-names')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester()

const message = 'Promise constructor parameters must be named resolve, reject'

ruleTester.run('param-names', rule, {
  valid: [
    'new Promise(function(resolve, reject) { })',
    'new Promise(function(resolve) { })'
  ],

  invalid: [
    {
      code: 'new Promise(function(reject, resolve) { })',
      errors: [{ message }]
    },
    {
      code: 'new Promise(function(resolve, rej) { })',
      errors: [{ message }]
    }
  ]
})
