'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const isPromise = require('./lib/is-promise')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces the proper number of arguments are passed to Promise functions.',
      url: getDocsUrl('valid-params'),
    },
    schema: [
      {
        type: 'object',
        properties: {
          exclude: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireOneOptionalArgument:
        'Promise.{{ name }}() requires 0 or 1 arguments, but received {{ numArgs }}',
      requireOneArgument:
        'Promise.{{ name }}() requires 1 argument, but received {{ numArgs }}',
      requireTwoOptionalArguments:
        'Promise.{{ name }}() requires 1 or 2 arguments, but received {{ numArgs }}',
    },
  },
  create(context) {
    const { exclude = [] } = context.options[0] || {}
    return {
      CallExpression(node) {
        if (!isPromise(node)) {
          return
        }

        const name = node.callee.property.name
        const numArgs = node.arguments.filter(
          (argument) => argument.type !== 'SpreadElement',
        ).length
        const hasSpread = numArgs !== node.arguments.length
        const data = {
          name,
          numArgs: hasSpread ? `at least ${numArgs}` : numArgs,
        }

        if (exclude.includes(name)) {
          return
        }

        // istanbul ignore next -- `isPromise` filters out others
        switch (name) {
          case 'resolve':
          case 'reject':
            if (numArgs > 1) {
              context.report({
                node,
                messageId: 'requireOneOptionalArgument',
                data,
              })
            }
            break
          case 'then':
            if ((!hasSpread && numArgs < 1) || numArgs > 2) {
              context.report({
                node,
                messageId: 'requireTwoOptionalArguments',
                data,
              })
            }
            break
          case 'race':
          case 'all':
          case 'allSettled':
          case 'any':
          case 'catch':
          case 'finally':
            if ((!hasSpread && numArgs < 1) || numArgs > 1) {
              context.report({
                node,
                messageId: 'requireOneArgument',
                data,
              })
            }
            break
          default:
            // istanbul ignore next -- `isPromise` filters out others
            break
        }
      },
    }
  },
}
