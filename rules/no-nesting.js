/**
 * Rule: no-nesting
 * Avoid nesting your promises.
 */

'use strict'

const hasPromiseCallback = require('./lib/has-promise-callback')
const isInsidePromise = require('./lib/is-inside-promise')

module.exports = {
  meta: {
    docs: {
      url: 'https://github.com/xjamundx/eslint-plugin-promise#no-nesting'
    }
  },
  create: function(context) {
    return {
      CallExpression: function(node) {
        if (!hasPromiseCallback(node)) return
        if (context.getAncestors().some(isInsidePromise)) {
          context.report({ node, message: 'Avoid nesting promises.' })
        }
      }
    }
  }
}
