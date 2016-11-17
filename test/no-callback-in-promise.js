'use strict'

var rule = require('../rules/no-callback-in-promise')
var RuleTester = require('eslint').RuleTester
var ruleTester = new RuleTester()

// messages
var errorMessage = 'Avoid calling back inside of a promise.'

ruleTester.run('no-callback-in-promise', rule, {
  valid: [
    'function thing(cb) { cb() }',
    'doSomething(function(err) { cb(err) })',
    'function thing(callback) { callback() }',
    'doSomething(function(err) { callback(err) })',

    // arrow functions and other things
    {code: 'let thing = (cb) => cb()', parserOptions: {ecmaVersion: 6}},
    {code: 'doSomething(err => cb(err))', parserOptions: {ecmaVersion: 6}}
  ],

  invalid: [
    {code: 'a.then(cb)', errors: [{message: errorMessage, column: 8}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(() => cb())', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(function(err) { cb(err) })', errors: [{message: errorMessage, column: 24}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(function(data) { cb(data) }, function(err) { cb(err) })', errors: [{column: 25, message: errorMessage}, {column: 53, message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.catch(function(err) { cb(err) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},

    // callback should also complain
    {code: 'a.then(callback)', errors: [{message: errorMessage, column: 8}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(() => callback())', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(function(err) { callback(err) })', errors: [{message: errorMessage, column: 24}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.then(function(data) { callback(data) }, function(err) { callback(err) })', errors: [{message: errorMessage}, {column: 59, message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a.catch(function(err) { callback(err) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}}
  ]
})
