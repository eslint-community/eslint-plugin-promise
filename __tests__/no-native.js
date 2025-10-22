'use strict'

const rule = require('../rules/no-native')
const { RuleTester } = require('./rule-tester')
const es5ParserOptions = {
  ecmaVersion: 5,
  sourceType: 'script',
}
const es6ParserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
}
const ruleTesters = [
  new RuleTester({
    parserOptions: es5ParserOptions,
  }),
  new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: es5ParserOptions,
  }),
]

for (const ruleTester of ruleTesters) {
  ruleTester.run('no-native', rule, {
    valid: [
      'var Promise = null; function x() { return Promise.resolve("hi"); }',
      'var Promise = window.Promise || require("bluebird"); var x = Promise.reject();',
      {
        code: 'import Promise from "bluebird"; var x = Promise.reject();',
        parserOptions: es6ParserOptions,
      },
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
      {
        code: 'new Promise(function(reject, resolve) { })',
        errors: [{ message: '"Promise" is not defined.' }],
        env: { browser: true },
      },
      {
        code: 'new Promise(function(reject, resolve) { })',
        errors: [{ message: '"Promise" is not defined.' }],
        env: { node: true },
      },
    ],
  })
}
