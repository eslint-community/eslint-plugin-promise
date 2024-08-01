/**
 * Rule: prefer-catch
 * Discourage using then(a, b) or then(null, b) and instead use catch().
 */

'use strict'

const getDocsUrl = require('./lib/get-docs-url')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `catch` to `then(a, b)`/`then(null, b)` for handling errors.',
      url: getDocsUrl('prefer-catch'),
    },
    schema: [],
    messages: {
      preferCatchToThen: 'Prefer `catch` to `then(a, b)`/`then(null, b)`.',
    },
  },
  create(context) {
    return {
      'CallExpression > MemberExpression.callee'(node) {
        if (
          node.property &&
          node.property.name === 'then' &&
          node.parent.arguments.length >= 2
        ) {
          context.report({
            node: node.property,
            messageId: 'preferCatchToThen',
          })
        }
      },
    }
  },
}
