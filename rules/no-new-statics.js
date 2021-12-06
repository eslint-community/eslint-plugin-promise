'use strict'

const PROMISE_STATICS = require('./lib/promise-statics')
const getDocsUrl = require('./lib/get-docs-url')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: getDocsUrl('no-new-statics'),
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'Promise' &&
          PROMISE_STATICS[node.callee.property.name]
        ) {
          context.report({
            node,
            message: "Avoid calling 'new' on 'Promise.{{ name }}()'",
            data: { name: node.callee.property.name },
            fix(fixer) {
              return fixer.replaceTextRange(
                [node.range[0], node.range[0] + 'new '.length],
                ''
              )
            },
          })
        }
      },
    }
  },
}
