'use strict'

const rule = require('../rules/prefer-await-to-then')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8,
  },
})

const message = 'Prefer await to then()/catch()/finally().'

ruleTester.run('prefer-await-to-then', rule, {
  valid: [
    'async function hi() { await thing() }',
    'async function hi() { await thing().then() }',
    'async function hi() { await thing().catch() }',
    'async function hi() { await thing().finally() }',
    'function * hi() { yield thing().then() }',
    'a = async () => (await something())',
    `a = async () => {
      try { await something() } catch (error) { somethingElse() }
    }`,
    'something().then(async () => await somethingElse())',
    'function foo() { hey.somethingElse(x => {}) }',
    `const isThenable = (obj) => {
      return obj && typeof obj.then === 'function';
    };`,
    `function isThenable(obj) {
      return obj && typeof obj.then === 'function';
    }`,
  ],

  invalid: [
    {
      code: 'function foo() { hey.then(x => {}) }',
      errors: [{ message }],
    },
    {
      code: 'function foo() { hey.then(function() { }).then() }',
      errors: [{ message }, { message }],
    },
    {
      code: 'function foo() { hey.then(function() { }).then(x).catch() }',
      errors: [{ message }, { message }, { message }],
    },
    {
      code: 'async function a() { hey.then(function() { }).then(function() { }) }',
      errors: [{ message }, { message }],
    },
    {
      code: 'function foo() { hey.catch(x => {}) }',
      errors: [{ message }],
    },
    {
      code: 'function foo() { hey.finally(x => {}) }',
      errors: [{ message }],
    },
    {
      code: 'async function hi() { await thing().then() }',
      errors: [{ message }],
      options: [
        {
          strict: true,
        },
      ],
    },
    {
      code: 'async function hi() { await thing().catch() }',
      errors: [{ message }],
      options: [
        {
          strict: true,
        },
      ],
    },
    {
      code: 'async function hi() { await thing().finally() }',
      errors: [{ message }],
      options: [
        {
          strict: true,
        },
      ],
    },
    {
      code: 'function * hi() { yield thing().then() }',
      errors: [{ message }],
      options: [
        {
          strict: true,
        },
      ],
    },
  ],
})
