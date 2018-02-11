'use strict'

const rule = require('../rules/param-names')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6
  }
})

const message = 'Promise constructor parameters must be named resolve, reject'

ruleTester.run('param-names', rule, {
  valid: [
    'new Promise(function(resolve, reject) {})',
    'new Promise(function(resolve) {})',
    'new Promise(resolve => {})',
    'new Promise((resolve, reject) => {})',
    'new Promise(() => {})'
  ],

  invalid: [
    {
      code: 'new Promise(function(reject, resolve) {})',
      errors: [{ message }],
      output: 'new Promise(function(resolve, reject) {})'
    },
    {
      code: 'new Promise(function(resolve, rej) {})',
      errors: [{ message }],
      output: 'new Promise(function(resolve, reject) {})'
    },
    {
      code: 'new Promise(yes => {})',
      errors: [{ message }],
      output: 'new Promise(resolve => {})'
    },
    {
      code: 'new Promise((yes, no) => {})',
      errors: [{ message }],
      output: 'new Promise((resolve, reject) => {})'
    }
  ]
})
