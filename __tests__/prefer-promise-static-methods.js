'use strict'

const rule = require('../rules/prefer-promise-static-methods')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

const resolveErrorMessage =
  'Prefer `Promise.resolve()` to `new Promise()`. The static method is faster, more readable and less verbose.'
const rejectErrorMessage =
  'Prefer `Promise.reject()` to `new Promise()`. The static method is faster, more readable and less verbose.'

ruleTester.run('prefer-promise-static-methods', rule, {
  valid: [
    `Promise.resolve(foo)`,
    `Promise.reject(bar)`,
    `new Promise(() => {})`,
    `new Promise((resolve) => setTimeout(resolve, 100))`,
    `new Promise(process.nextTick)`,
    `new Promise((resolve) => { resolve(foo); resolve(bar) })`,
    `new Promise((resolve, reject) => { foo(bar) })`,
    `new Promise((resolve, reject) => { foo && resolve(bar) })`,
    `new Promise((...args) => {})`,
    // This is a type error but the rule wouldn't check it
    `new Promise(([foo, bar]) => {})`,
    `new Promise(([foo, bar] = []) => {})`,
  ],

  invalid: [
    {
      code: `new Promise((resolve) => resolve(foo))`,
      output: `Promise.resolve(foo)`,
      errors: [{ message: resolveErrorMessage }],
    },
    {
      code: `new Promise((resolve) => { resolve(foo) })`,
      output: `Promise.resolve(foo)`,
      errors: [{ message: resolveErrorMessage }],
    },
    {
      code: `new Promise((resolve) => resolve())`,
      output: `Promise.resolve()`,
      errors: [{ message: resolveErrorMessage }],
    },
    {
      code: `new Promise((_, reject) => reject(foo))`,
      output: `Promise.reject(foo)`,
      errors: [{ message: rejectErrorMessage }],
    },
    {
      code: `new Promise((resolve, reject) => { reject(foo) })`,
      output: `Promise.reject(foo)`,
      errors: [{ message: rejectErrorMessage }],
    },
    {
      code: `new Promise(function foo(resolve, reject) { reject(bar) })`,
      output: `Promise.reject(bar)`,
      errors: [{ message: rejectErrorMessage }],
    },
    {
      code: `new Promise((resolve = unusedDefault) => resolve())`,
      output: `Promise.resolve()`,
      errors: [{ message: resolveErrorMessage }],
    },
  ],
})
