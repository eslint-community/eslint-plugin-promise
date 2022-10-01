'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const {
  isPromiseConstructorWithInlineExecutor,
} = require('./lib/is-promise-constructor')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: getDocsUrl('param-names'),
    },
    schema: [],
  },
  create(context) {
    return {
      NewExpression(node) {
        if (isPromiseConstructorWithInlineExecutor(node)) {
          const params = node.arguments[0].params

          if (!params || !params.length) {
            return
          }

          if (
            (params[0].name !== 'resolve' && params[0].name !== '_resolve') ||
            (params[1] &&
              params[1].name !== 'reject' &&
              params[1].name !== '_reject')
          ) {
            context.report({
              node,
              message:
                'Promise constructor parameters must be named resolve, reject',
            })
          }
        }
      },
    }
  },
}
