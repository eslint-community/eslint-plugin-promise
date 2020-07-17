/**
 * Rule: wrap-await-with-try-catch
 */

'use strict'

const getDocsUrl = require('./lib/get-docs-url')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: getDocsUrl('wrap-await-with-try-catch')
    }
  },
  create(context) {
    function isAwaitHandled() {
      const ancestors = context.getAncestors()
      let handledInOrder = []

      ancestors.forEach(ancestor => {
        if (ancestor.type === 'TryStatement') {
          handledInOrder.push({
            name: 'try',
            node: ancestor,
            relatedTry: ancestor
          })
        } else if (ancestor.type === 'CatchClause') {
          handledInOrder.push({
            name: 'catch',
            node: ancestor,
            relatedTry: ancestor.parent
          })
        } else if (
          ancestor.type === 'BlockStatement' &&
          ancestor.parent &&
          ancestor.parent.type === 'TryStatement' &&
          ancestor.parent.finalizer === ancestor
        ) {
          handledInOrder.push({
            name: 'finally',
            node: ancestor,
            relatedTry: ancestor.parent
          })
        } else if (
          ancestor.type === 'FunctionExpression' ||
          ancestor.type === 'FunctionDeclaration'
        ) {
          // clear the current parents, we are in a new function
          handledInOrder = []
        }
      })

      if (handledInOrder.length === 0) {
        return false
      }

      let lastItem = handledInOrder[handledInOrder.length - 1]

      while (
        handledInOrder.length > 0 &&
        !(lastItem.name === 'try' && lastItem.node.handler)
      ) {
        const tryToBeDeleted = lastItem.relatedTry

        while (
          handledInOrder.length > 0 &&
          lastItem.relatedTry == tryToBeDeleted
        ) {
          handledInOrder.pop()
          lastItem = handledInOrder[handledInOrder.length - 1]
        }
      }

      return handledInOrder.length > 0
    }

    return {
      AwaitExpression(node) {
        if (isAwaitHandled()) {
          return
        }

        context.report({
          node,
          message: '"await"s must be wrapped with a try/catch statement.'
        })
      }
    }
  }
}
