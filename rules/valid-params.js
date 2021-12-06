'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const isPromise = require('./lib/is-promise')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensures the proper number of arguments are passed to Promise functions',
      url: getDocsUrl('valid-params'),
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!isPromise(node)) {
          return
        }

        const name = node.callee.property.name
        const numArgs = node.arguments.length

        // istanbul ignore next -- `isPromise` filters out others
        switch (name) {
          case 'resolve':
          case 'reject':
            if (numArgs > 1) {
              context.report({
                node,
                message:
                  'Promise.{{ name }}() requires 0 or 1 arguments, but received {{ numArgs }}',
                data: { name, numArgs },
              })
            }
            break
          case 'then':
            if (numArgs < 1 || numArgs > 2) {
              context.report({
                node,
                message:
                  'Promise.{{ name }}() requires 1 or 2 arguments, but received {{ numArgs }}',
                data: { name, numArgs },
              })
            }
            break
          case 'race':
          case 'all':
          case 'catch':
          case 'finally':
            if (numArgs !== 1) {
              context.report({
                node,
                message:
                  'Promise.{{ name }}() requires 1 argument, but received {{ numArgs }}',
                data: { name, numArgs },
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
