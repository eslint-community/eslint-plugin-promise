'use strict'

const rule = require('../rules/no-native')
const { RuleTester } = require('./rule-tester')
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
}
const ruleTesters = [
  new RuleTester({
    parserOptions,
  }),
  new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions,
  }),
]

for (const ruleTester of ruleTesters) {
  ruleTester.run('no-native', rule, {
    valid: [
      'var Promise = null; function x() { return Promise.resolve("hi"); }',
      'var Promise = window.Promise || require("bluebird"); var x = Promise.reject();',
      'import Promise from "bluebird"; var x = Promise.reject();',
    ],

    invalid: [
      {
        code: 'new Promise(function(reject, resolve) { })',
        errors: [{ message: '"Promise" is not defined.' }],
      },
      {
        code: 'Promise.resolve()',
        errors: [{ message: '"Promise" is not defined.' }],
      },
      // {
      //   code: 'new Promise(function(reject, resolve) { })',
      //   errors: [{ message: '"Promise" is not defined.' }],
      //   env: { browser: true },
      // },
      // {
      //   code: 'new Promise(function(reject, resolve) { })',
      //   errors: [{ message: '"Promise" is not defined.' }],
      //   env: { node: true },
      // },
      // {
      //   code: 'Promise.resolve()',
      //   errors: [{ message: '"Promise" is not defined.' }],
      //   env: { es6: true },
      // },
      // {
      //   code: 'Promise.resolve()',
      //   errors: [{ message: '"Promise" is not defined.' }],
      //   globals: { Promise: true },
      // },
    ],
  })
}
