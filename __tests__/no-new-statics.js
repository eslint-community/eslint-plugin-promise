'use strict'

const rule = require('../rules/no-new-statics')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester()

const message = 'Avoid calling new on a Promise static method'

ruleTester.run('no-new-statics', rule, {
  valid: [
    'Promise.resolve()',
    'Promise.reject()',
    'Promise.all()',
    'Promise.race()',
    'new Promise(function (resolve, reject) {})',
    'new SomeClass()',
    'SomeClass.resolve()',
    'new SomeClass.resolve()'
  ],
  invalid: [
    { code: 'new Promise.resolve()', errors: [{ message }] },
    { code: 'new Promise.reject()', errors: [{ message }] },
    { code: 'new Promise.all()', errors: [{ message }] },
    { code: 'new Promise.race()', errors: [{ message }] }
  ]
})
