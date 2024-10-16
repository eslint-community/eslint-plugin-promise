'use strict'

const rule = require('../rules/spec-only')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester()

ruleTester.run('spec-only', rule, {
  valid: [
    'Promise.resolve()',
    'Promise.reject()',
    'Promise.all()',
    'Promise["all"]',
    'Promise[method];',
    'Promise.prototype;',
    'Promise.prototype[method];',
    'Promise.prototype["then"];',
    'Promise.race()',
    'var ctch = Promise.prototype.catch',
    'Promise.withResolvers()',
    'new Promise(function (resolve, reject) {})',
    'SomeClass.resolve()',
    'doSomething(Promise.all)',
    {
      code: 'Promise.permittedMethod()',
      options: [
        {
          allowedMethods: ['permittedMethod'],
        },
      ],
    },
    {
      code: 'Promise.prototype.permittedInstanceMethod',
      options: [
        {
          allowedMethods: ['permittedInstanceMethod'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'Promise.done()',
      errors: [{ message: "Avoid using non-standard 'Promise.done'" }],
    },
    {
      code: 'Promise.something()',
      errors: [{ message: "Avoid using non-standard 'Promise.something'" }],
    },
    {
      code: 'new Promise.done()',
      errors: [{ message: "Avoid using non-standard 'Promise.done'" }],
    },
    {
      code: `
        function foo() {
          var a = getA()
          return Promise.done(a)
        }
      `,
      errors: [{ message: "Avoid using non-standard 'Promise.done'" }],
    },
    {
      code: `
        function foo() {
          getA(Promise.done)
        }
      `,
      errors: [{ message: "Avoid using non-standard 'Promise.done'" }],
    },
    {
      code: `var done = Promise.prototype.done`,
      errors: [{ message: "Avoid using non-standard 'Promise.prototype'" }],
    },
    {
      code: `Promise["done"];`,
      errors: [{ message: "Avoid using non-standard 'Promise.done'" }],
    },
  ],
})
