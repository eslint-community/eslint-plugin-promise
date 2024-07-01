/**
 * Rule: prefer-promise-static-methods
 * Prefer `Promise.resolve(foo)` to `new Promise((resolve) => resolve(foo))`.
 */

'use strict'

const { getSourceCode } = require('./lib/eslint-compat')
const getDocsUrl = require('./lib/get-docs-url')
const {
  isPromiseConstructorWithInlineExecutor,
} = require('./lib/is-promise-constructor')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `Promise.resolve(foo)` to `new Promise((resolve) => resolve(foo))`.',
      url: getDocsUrl('prefer-promise-static-methods'),
    },
    messages: {
      replaceWithStaticMethod:
        'Prefer `Promise.{{ method }}()` to `new Promise()`. The static method is faster, more readable and less verbose.',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const sourceCode = getSourceCode(context)
    /**
     * Report an error if the given node is a call to `resolve` or `reject`.
     * @param {import('estree').SimpleCallExpression} callNode
     * @param {import('estree').NewExpression} constructorNode
     * @param {Array<string | undefined>} parameterNames
     */
    function reportIfIsPromiseCall(callNode, constructorNode, parameterNames) {
      if (
        callNode.callee.type === 'Identifier' &&
        callNode.arguments.length <= 1
      ) {
        /** @type {'resolve' | 'reject'} */
        let method
        if (callNode.callee.name === parameterNames[0]) {
          method = 'resolve'
        } else if (callNode.callee.name === parameterNames[1]) {
          method = 'reject'
        } else {
          return
        }

        // Value passed to resolve/reject method
        const valueNode = callNode.arguments[0]
        const valueText = valueNode
          ? sourceCode.getText(callNode.arguments[0])
          : ''
        context.report({
          node: callNode,
          messageId: 'replaceWithStaticMethod',
          data: { method },
          fix: (fixer) =>
            fixer.replaceText(
              constructorNode,
              `Promise.${method}(${valueText})`
            ),
        })
      }
    }

    return {
      NewExpression(node) {
        if (isPromiseConstructorWithInlineExecutor(node)) {
          const func = node.arguments[0]
          const parameterNames = getParameterNames(func.params)

          if (func.body.type === 'CallExpression') {
            // (resolve) => resolve(foo)
            reportIfIsPromiseCall(func.body, node, parameterNames)
          } else if (
            func.body.type === 'BlockStatement' &&
            func.body.body.length === 1
          ) {
            const statement = func.body.body[0]
            if (
              statement.type === 'ExpressionStatement' &&
              statement.expression.type === 'CallExpression'
            ) {
              // (resolve) => { resolve(foo) }
              reportIfIsPromiseCall(statement.expression, node, parameterNames)
            }
          }
        }
      },
    }
  },
}

/**
 * Given AST for `(resolve, reject) => {...}` params, return `['resolve', 'reject']`.
 * @param {import('estree').Pattern[]} params
 */
function getParameterNames(params) {
  /** @type {Array<string | undefined>} */
  const names = []
  for (const param of params) {
    switch (param.type) {
      // (resolve) =>
      case 'Identifier':
        names.push(param.name)
        break
      // (resolve = foo) =>
      case 'AssignmentPattern':
        if (param.left.type === 'Identifier') {
          names.push(param.left.name)
        } else {
          names.push(undefined)
        }
        break
      // (...args) =>
      case 'RestElement':
        // there won't be any more valid names
        return names
      // ([resolve]) =>
      default:
        names.push(undefined)
        break
    }
  }

  return names
}
