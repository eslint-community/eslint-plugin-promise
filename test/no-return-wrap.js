'use strict'

var rule = require('../rules/no-return-wrap')
var RuleTester = require('eslint').RuleTester
var ruleTester = new RuleTester()

// messages
var rejectMessage = 'Expected throw instead of Promise.reject'
var resolveMessage = 'Avoid wrapping return values in Promise.resolve'

ruleTester.run('no-return-wrap', rule, {
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

    // other Promise.things are fine
    'doThing().then(function() { return Promise.all([a,b,c]) })',

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
    'doThing(function(x) { return Promise.reject(x) })'
  ],

  invalid: [

    // wrapped resolve is bad
    {code: 'doThing().then(function() { return Promise.resolve(4) })', errors: [{message: resolveMessage}]},
    {code: 'doThing().then(null, function() { return Promise.resolve(4) })', errors: [{message: resolveMessage}]},
    {code: 'doThing().catch(function() { return Promise.resolve(4) })', errors: [{message: resolveMessage}]},

    // wrapped reject is bad
    {code: 'doThing().then(function() { return Promise.reject(4) })', errors: [{message: rejectMessage}]},
    {code: 'doThing().then(null, function() { return Promise.reject(4) })', errors: [{message: rejectMessage}]},
    {code: 'doThing().catch(function() { return Promise.reject(4) })', errors: [{message: rejectMessage}]},

    // needs to also look at weird paths
    {
      code: 'doThing().then(function(x) { if (x>1) { return Promise.resolve(4) } else { throw "bad" } })',
      errors: [{message: resolveMessage}]
    },
    {code: 'doThing().then(function(x) { if (x>1) { return Promise.reject(4) } })', errors: [{message: rejectMessage}]},
    {
      code: 'doThing().then(null, function() { if (true && false) { return Promise.resolve() } })',
      errors: [{message: resolveMessage}]
    },

    // should do both
    {code: 'doThing().catch(function(x) {if (x) { return Promise.resolve(4) } else { return Promise.reject() } })', errors: [{message: resolveMessage}, {message: rejectMessage}]}

    // should work someday
    // {code: 'doThing().catch(function(x) { return x && Promise.resolve(4) })', errors: [{message: resolveMessage}]},
    // {code: 'doThing().catch(function(x) { return true ? Promise.resolve(4) : Promise.reject(5) })', errors: [{message: rejectMessage }, {message: resolveMessage}]},
    // {code: 'doThing().catch(function(x) { return x && Promise.reject(4) })', errors: [{message: rejectMessage}]}

  ]
})
