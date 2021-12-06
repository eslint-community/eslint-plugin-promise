'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const isPromise = require('./lib/is-promise')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: getDocsUrl('no-return-in-finally'),
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (isPromise(node)) {
          if (
            node.callee &&
            node.callee.property &&
            node.callee.property.name === 'finally'
          ) {
            // istanbul ignore else -- passing `isPromise` means should have a body
            if (
              node.arguments &&
              node.arguments[0] &&
              node.arguments[0].body &&
              node.arguments[0].body.body
            ) {
              if (
                node.arguments[0].body.body.some((statement) => {
                  return statement.type === 'ReturnStatement'
                })
              ) {
                context.report({
                  node: node.callee.property,
                  message: 'No return in finally',
                })
              }
            }
          }
        }
      },
    }
  },
}
