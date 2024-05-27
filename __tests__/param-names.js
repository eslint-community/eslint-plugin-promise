'use strict'

const rule = require('../rules/param-names')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

const messageForResolve =
  'Promise constructor parameters must be named to match "^_?resolve$"'
const messageForReject =
  'Promise constructor parameters must be named to match "^_?reject$"'

ruleTester.run('param-names', rule, {
  valid: [
    'new Promise(function(resolve, reject) {})',
    'new Promise(function(resolve, _reject) {})',
    'new Promise(function(_resolve, reject) {})',
    'new Promise(function(_resolve, _reject) {})',
    'new Promise(function(resolve) {})',
    'new Promise(function(_resolve) {})',
    'new Promise(resolve => {})',
    'new Promise((resolve, reject) => {})',
    'new Promise(() => {})',
    'new NonPromise()',
    {
      code: 'new Promise((yes, no) => {})',
      options: [{ resolvePattern: '^yes$', rejectPattern: '^no$' }],
    },
  ],

  invalid: [
    {
      code: 'new Promise(function(reject, resolve) {})',
      errors: [{ message: messageForResolve }, { message: messageForReject }],
    },
    {
      code: 'new Promise(function(resolve, rej) {})',
      errors: [{ message: messageForReject }],
    },
    {
      code: 'new Promise(yes => {})',
      errors: [{ message: messageForResolve }],
    },
    {
      code: 'new Promise((yes, no) => {})',
      errors: [{ message: messageForResolve }, { message: messageForReject }],
    },
    {
      code: 'new Promise(function(resolve, reject) {})',
      options: [{ resolvePattern: '^yes$', rejectPattern: '^no$' }],
      errors: [
        {
          message:
            'Promise constructor parameters must be named to match "^yes$"',
        },
        {
          message:
            'Promise constructor parameters must be named to match "^no$"',
        },
      ],
    },
  ],
})
