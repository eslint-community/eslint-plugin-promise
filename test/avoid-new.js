'use strict'

var rule = require('../rules/avoid-new')
var RuleTester = require('eslint').RuleTester
var ruleTester = new RuleTester()

// messages
var errorMessage = 'Avoid creating new promises.'

ruleTester.run('avoid-new', rule, {
  valid: [
    'Promise.resolve()',
    'Promise.reject()',
    'Promise.all()',
    'new Horse()',
    'new PromiseLikeThing()',
    'new Promise.resolve()'
  ],

  invalid: [
    {code: 'var x = new Promise(function (x, y) {})', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'new Promise()', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'Thing(new Promise(() => {}))', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}}
  ]
})
