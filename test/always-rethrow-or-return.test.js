'use strict'

var rule = require('../rules/always-rethrow-or-return')
var RuleTester = require('eslint').RuleTester

var ecmaFeatures = { arrowFunctions: true }

var ruleTester = new RuleTester()
ruleTester.run('always-rethrow-or-return', rule, {

  valid: [
    'promise.catch(function() { return next(); })',
    'promise.catch(function(err) { throw err; })',
    'promise.then(function() {}, function() { return next(); })',
    'promise.then(function() {}, function(err) { throw err; })',
    'promise.then(function() {}, randomIdentifier)',
    'promise.catch(randomIdentifier)',
    {code: 'promise.then(() => {}, err => err)', ecmaFeatures: ecmaFeatures},
    {code: 'promise.catch(err => err)', ecmaFeatures: ecmaFeatures},
    {code: 'promise.catch(() => { return next(); })', ecmaFeatures: ecmaFeatures},
    {code: 'promise.catch((err) => { throw err; })', ecmaFeatures: ecmaFeatures},
    {code: 'promise.then(() => {}, () => { return next(); })', ecmaFeatures: ecmaFeatures},
    {code: 'promise.then(() => {}, (err) => { throw err; })', ecmaFeatures: ecmaFeatures}
  ],

  invalid: [
    {
      code: 'promise.catch(function() { doWorkButDontRethrow(); })',
      errors: [{
        message: 'Should rethrow errors or handle by returning some value when catching within a Promise!',
        type: 'FunctionExpression'
      }]
    },
    {
      code: 'promise.then(function() {}, function() { doWorkButDontRethrow(); })',
      errors: [{
        message: 'Should rethrow errors or handle by returning some value when catching within a Promise!',
        type: 'FunctionExpression'
      }]
    },
    {
      code: 'promise.catch(() => { doWorkButDontRethrow(); })',
      ecmaFeatures: ecmaFeatures,
      errors: [{
        message: 'Should rethrow errors or handle by returning some value when catching within a Promise!',
        type: 'ArrowFunctionExpression'
      }]
    },
    {
      code: 'promise.then(() => {}, () => { doWorkButDontRethrow(); })',
      ecmaFeatures: ecmaFeatures,
      errors: [{
        message: 'Should rethrow errors or handle by returning some value when catching within a Promise!',
        type: 'ArrowFunctionExpression'
      }]
    }
  ]
})
