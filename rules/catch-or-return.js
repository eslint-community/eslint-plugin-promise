/**
 * Rule: catch-or-return
 * Ensures that promises either include a catch() handler
 * or are returned (to be handled upstream)
 */

var isPromise = require('./lib/is-promise')

module.exports = {
  create: function (context) {
    var options = context.options[0] || {}
    var allowThen = options.allowThen
    var terminationMethod = options.terminationMethod || 'catch'

    return {
      ExpressionStatement: function (node) {
        if (!isPromise(node.expression)) {
          return
        }

        // somePromise.then(a, b)
        if (allowThen &&
          node.expression.type === 'CallExpression' &&
          node.expression.callee.type === 'MemberExpression' &&
          node.expression.callee.property.name === 'then' &&
          node.expression.arguments.length === 2
        ) {
          return
        }

        // somePromise.catch()
        if (node.expression.type === 'CallExpression' &&
          node.expression.callee.type === 'MemberExpression' &&
          node.expression.callee.property.name === terminationMethod
        ) {
          return
        }
        context.report(node, 'Expected ' + terminationMethod + '() or return')
      }
    }
  }
}
