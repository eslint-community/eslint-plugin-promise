/**
 * Rule: no-callback-in-promise
 * Avoid calling back inside of a promise
 */

'use strict'

var hasPromiseCallback = require('./lib/has-promise-callback')
var isInsidePromise = require('./lib/is-inside-promise')
var isCallback = require('./lib/is-callback')

module.exports = {
  meta: {
    docs: {
      url:
        'https://github.com/xjamundx/eslint-plugin-promise#no-callback-in-promise'
    }
  },
  create: function(context) {
    return {
      CallExpression: function(node) {
        var options = context.options[0] || {}
        var exceptions = options.exceptions || []
        if (!isCallback(node, exceptions)) {
          // in general we send you packing if you're not a callback
          // but we also need to watch out for whatever.then(cb)
          if (hasPromiseCallback(node)) {
            var name =
              node.arguments && node.arguments[0] && node.arguments[0].name
            if (
              name === 'callback' ||
              name === 'cb' ||
              name === 'next' ||
              name === 'done'
            ) {
              context.report({
                node: node.arguments[0],
                message: 'Avoid calling back inside of a promise.'
              })
            }
          }
          return
        }
        if (context.getAncestors().some(isInsidePromise)) {
          context.report({
            node,
            message: 'Avoid calling back inside of a promise.'
          })
        }
      }
    }
  }
}
