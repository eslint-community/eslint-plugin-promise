'use strict'

var rule = require('../rules/no-nesting')
var RuleTester = require('eslint').RuleTester
var ruleTester = new RuleTester()

// messages
var errorMessage = 'Avoid nesting promises.'

ruleTester.run('no-nesting', rule, {
  valid: [

    // resolve and reject are sometimes okay
    'Promise.resolve(4).then(function(x) { return x })',
    'Promise.reject(4).then(function(x) { return x })',
    'Promise.resolve(4).then(function() {})',
    'Promise.reject(4).then(function() {})',

    // throw and return are fine
    'doThing().then(function() { return 4 })',
    'doThing().then(function() { throw 4 })',
    'doThing().then(null, function() { return 4 })',
    'doThing().then(null, function() { throw 4 })',
    'doThing().catch(null, function() { return 4 })',
    'doThing().catch(null, function() { throw 4 })',

    // arrow functions and other things
    {code: 'doThing().then(() => 4)', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => { throw 4 })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(()=>{}, () => 4)', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(()=>{}, () => { throw 4 })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().catch(() => 4)', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().catch(() => { throw 4 })', parserOptions: {ecmaVersion: 6}},

    // random functions and callback methods
    'var x = function() { return Promise.resolve(4) }',
    'function y() { return Promise.resolve(4) }',
    'function then() { return Promise.reject() }',
    'doThing(function(x) { return Promise.reject(x) })',

    // this should be allowed basically, we're mostly raging against using then()
    {code: 'doThing().then(function() { return Promise.all([a,b,c]) })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(function() { return Promise.resolve(4) })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => Promise.resolve(4))', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => Promise.all([a]))', parserOptions: {ecmaVersion: 6}}
  ],

  invalid: [

    {code: 'doThing().then(function() { a.then() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(function() { b.catch() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(function() { return a.then() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(function() { return b.catch() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => { a.then() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => { b.catch() })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => a.then())', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => b.catch())', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}}

  ]
})
