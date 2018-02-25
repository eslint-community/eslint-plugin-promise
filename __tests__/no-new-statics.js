'use strict'

const rule = require('../rules/no-new-statics')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester()

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
    {
      code: 'new Promise.resolve()',
      errors: [{ message: "Avoid calling 'new' on 'Promise.resolve()'" }]
    },
    {
      code: 'new Promise.reject()',
      errors: [{ message: "Avoid calling 'new' on 'Promise.reject()'" }]
    },
    {
      code: 'new Promise.all()',
      errors: [{ message: "Avoid calling 'new' on 'Promise.all()'" }]
    },
    {
      code: 'new Promise.race()',
      errors: [{ message: "Avoid calling 'new' on 'Promise.race()'" }]
    }
  ]
})
