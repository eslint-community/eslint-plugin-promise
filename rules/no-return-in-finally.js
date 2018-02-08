'use strict'

var isPromise = require('./lib/is-promise')

module.exports = {
  meta: {
    docs: {
      url: 'https://github.com/xjamundx/eslint-plugin-promise#no-return-in-finally'
    }
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (isPromise(node)) {
          if (node.callee && node.callee.property && node.callee.property.name === 'finally') {
            if (node.arguments && node.arguments[0] && node.arguments[0].body && node.arguments[0].body.body) {
              if (node.arguments[0].body.body.some(function (statement) { return statement.type === 'ReturnStatement' })) {
                context.report({ node: node.callee.property, message: 'No return in finally' })
              }
            }
          }
        }
      }
    }
  }
}
