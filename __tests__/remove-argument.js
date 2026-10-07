'use strict'

const removeArgument = require('../rules/fix/remove-argument')
const { getSourceCode } = require('../rules/lib/eslint-compat')
const { RuleTester } = require('./rule-tester')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8,
  },
})

ruleTester.run(
  'remove-argument',
  {
    meta: {
      fixable: 'code',
      schema: [],
      messages: { removeArgument: 'Remove the second argument.' },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (node.arguments.length === 2) {
            context.report({
              node,
              messageId: 'removeArgument',
              fix(fixer) {
                return removeArgument(
                  fixer,
                  node.arguments[1],
                  getSourceCode(context),
                )
              },
            })
          }
        },
      }
    },
  },
  {
    valid: ['fn()', 'fn(first)'],
    invalid: [
      {
        code: 'fn(first, second)',
        output: 'fn(first)',
        errors: [{ messageId: 'removeArgument' }],
      },
      {
        code: 'fn(first, (second))',
        output: 'fn(first)',
        errors: [{ messageId: 'removeArgument' }],
      },
    ],
  },
)
