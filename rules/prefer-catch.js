/**
 * Rule: prefer-catch
 * Discourage using then(a, b) or then(null, b) and instead use catch().
 */

'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const { getSourceCode, getScope } = require('./lib/eslint-compat')
const removeArgument = require('./fix/remove-argument')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `catch` to `then(a, b)`/`then(null, b)` for handling errors.',
      url: getDocsUrl('prefer-catch'),
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferCatchToThen: 'Prefer `catch` to `then(a, b)`/`then(null, b)`.',
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context)
    return {
      'CallExpression > MemberExpression.callee'(node) {
        if (
          node.property?.name === 'then' &&
          node.parent.arguments.length >= 2
        ) {
          context.report({
            node: node.property,
            messageId: 'preferCatchToThen',
            *fix(fixer) {
              const then = node.parent.arguments[0]
              const reference =
                then.type === 'Identifier' && then.name === 'undefined'
                  ? getScope(context, then).references.find(
                      (ref) => ref.identifier === then,
                    )
                  : null
              const isGlobalUndefined =
                reference &&
                !reference.tainted &&
                reference.resolved?.defs.length === 0

              if (
                !node.computed &&
                ((then.type === 'Literal' && then.value === null) ||
                  isGlobalUndefined)
              ) {
                yield removeArgument(fixer, then, sourceCode)
                yield fixer.replaceText(node.property, 'catch')
              }
            },
          })
        }
      },
    }
  },
}
