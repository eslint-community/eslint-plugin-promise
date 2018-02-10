'use strict'

const rule = require('../rules/no-return-wrap')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6
  }
})

const rejectMessage = 'Expected throw instead of Promise.reject'
const resolveMessage = 'Avoid wrapping return values in Promise.resolve'

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
    'doThing().then(() => 4)',
    'doThing().then(() => { throw 4 })',
    'doThing().then(()=>{}, () => 4)',
    'doThing().then(()=>{}, () => { throw 4 })',
    'doThing().catch(() => 4)',
    'doThing().catch(() => { throw 4 })',

    // random functions and callback methods
    'var x = function() { return Promise.resolve(4) }',
    'function y() { return Promise.resolve(4) }',
    'function then() { return Promise.reject() }',
    'doThing(function(x) { return Promise.reject(x) })',

    // should work with empty return statement
    'doThing().then(function() { return })',

    // allow reject if specified
    {
      code: 'doThing().then(function() { return Promise.reject(4) })',
      options: [{ allowReject: true }]
    }
  ],

  invalid: [
    // wrapped resolve is bad
    {
      code: 'doThing().then(function() { return Promise.resolve(4) })',
      errors: [{ message: resolveMessage }]
    },
    {
      code: 'doThing().then(null, function() { return Promise.resolve(4) })',
      errors: [{ message: resolveMessage }]
    },
    {
      code: 'doThing().catch(function() { return Promise.resolve(4) })',
      errors: [{ message: resolveMessage }]
    },

    // wrapped reject is bad
    {
      code: 'doThing().then(function() { return Promise.reject(4) })',
      errors: [{ message: rejectMessage }]
    },
    {
      code: 'doThing().then(null, function() { return Promise.reject(4) })',
      errors: [{ message: rejectMessage }]
    },
    {
      code: 'doThing().catch(function() { return Promise.reject(4) })',
      errors: [{ message: rejectMessage }]
    },

    // needs to also look at weird paths
    {
      code:
        'doThing().then(function(x) { if (x>1) { return Promise.resolve(4) } else { throw "bad" } })',
      errors: [{ message: resolveMessage }]
    },
    {
      code:
        'doThing().then(function(x) { if (x>1) { return Promise.reject(4) } })',
      errors: [{ message: rejectMessage }]
    },
    {
      code:
        'doThing().then(null, function() { if (true && false) { return Promise.resolve() } })',
      errors: [{ message: resolveMessage }]
    },

    // should do both
    {
      code:
        'doThing().catch(function(x) {if (x) { return Promise.resolve(4) } else { return Promise.reject() } })',
      errors: [{ message: resolveMessage }, { message: rejectMessage }]
    }

    // should work someday
    // {code: 'doThing().catch(function(x) { return x && Promise.resolve(4) })', errors: [{message: resolveMessage}]},
    // {code: 'doThing().catch(function(x) { return true ? Promise.resolve(4) : Promise.reject(5) })', errors: [{message: rejectMessage }, {message: resolveMessage}]},
    // {code: 'doThing().catch(function(x) { return x && Promise.reject(4) })', errors: [{message: rejectMessage}]}
  ]
})
