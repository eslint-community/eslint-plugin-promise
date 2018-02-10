/**
 * Rule: avoid-new
 * Avoid creating new promises outside of utility libraries.
 */

'use strict'

module.exports = {
  meta: {
    docs: {
      url: 'https://github.com/xjamundx/eslint-plugin-promise#avoid-new'
    }
  },
  create: function(context) {
    return {
      NewExpression: function(node) {
        if (node.callee.name === 'Promise') {
          context.report({ node, message: 'Avoid creating new promises.' })
        }
      }
    }
  }
}
