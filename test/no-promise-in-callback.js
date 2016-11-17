'use strict'

var rule = require('../rules/no-promise-in-callback')
var RuleTester = require('eslint').RuleTester
var ruleTester = new RuleTester()

// messages
var errorMessage = 'Avoid using promises inside of callbacks.'

ruleTester.run('no-promise-in-callback', rule, {
  valid: [

    'go(function() { return Promise.resolve(4) })',
    'go(function() { return a.then(b) })',
    'go(function() { b.catch(c) })',
    'go(function() { b.then(c, d) })',

    // arrow functions and other things
    {code: 'go(() => Promise.resolve(4))', parserOptions: {ecmaVersion: 6}},
    {code: 'go((errrr) => a.then(b))', parserOptions: {ecmaVersion: 6}},
    {code: 'go((elpers) => { b.catch(c) })', parserOptions: {ecmaVersion: 6}},
    {code: 'go((e) => { b.then(c, d) })', parserOptions: {ecmaVersion: 6}},

    // within promises it won't complain
    {code: 'a.catch((err) => { b.then(c, d) })', parserOptions: {ecmaVersion: 6}},

    // random unrelated things
    'var x = function() { return Promise.resolve(4) }',
    'function y() { return Promise.resolve(4) }',
    'function then() { return Promise.reject() }',
    'doThing(function(x) { return Promise.reject(x) })',
    {code: 'doThing().then(function() { return Promise.all([a,b,c]) })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(function() { return Promise.resolve(4) })', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => Promise.resolve(4))', parserOptions: {ecmaVersion: 6}},
    {code: 'doThing().then(() => Promise.all([a]))', parserOptions: {ecmaVersion: 6}},

    // weird case, we assume it's not a big deal if you return (even though you may be cheating)
    {code: 'a(function(err) { return doThing().then(a) })', parserOptions: {ecmaVersion: 6}}

  ],

  invalid: [
    {code: 'a(function(err) { doThing().then(a) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a(function(error, zup, supa) { doThing().then(a) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a(function(error) { doThing().then(a) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},

    // arrow function
    {code: 'a((error) => { doThing().then(a) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a((error) => doThing().then(a))', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a((err, data) => { doThing().then(a) })', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'a((err, data) => doThing().then(a))', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},

    // function decl. and similar (why not)
    {code: 'function x(err) { Promise.all() }', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}},
    {code: 'let x = (err) => doThingWith(err).then(a)', errors: [{message: errorMessage}], parserOptions: {ecmaVersion: 6}}
  ]
})
