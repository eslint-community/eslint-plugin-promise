'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const isPromise = require('./lib/is-promise')

const checkObjectPatternIdentity = createIdentityCheck({
  type: 'ObjectExpression',
  areAllIdentifiers: expression => {
    return expression.properties.every(
      property => property.key.type === 'Identifier'
    )
  },
  toSetOfNames: node => {
    return new Set(node.properties.map(property => property.key.name))
  }
})

const checkArrayPatternIdentity = createIdentityCheck({
  type: 'ArrayExpression',
  areAllIdentifiers: expression => {
    return expression.elements.every(element => element.type === 'Identifier')
  },
  toSetOfNames: node => {
    return new Set(node.elements.map(element => element.name))
  }
})

function createIdentityCheck(config) {
  function difference(setA, setB) {
    return new Set(Array.from(setA).filter(x => !setB.has(x)))
  }

  function containsSameIdentifierNames(expressionA, expressionB) {
    const setA = config.toSetOfNames(expressionA)
    const setB = config.toSetOfNames(expressionB)
    return setA.size === setB.size && difference(setA, setB).size === 0
  }

  function checkIdentity(firstParam, body) {
    return (
      config.areAllIdentifiers(body) &&
      containsSameIdentifierNames(firstParam, body)
    )
  }

  return (firstParam, body) => {
    switch (body.type) {
      case config.type:
        return checkIdentity(firstParam, body)
      case 'BlockStatement':
        const firstBodyStatement = body.body[0]
        return firstBodyStatement.type === 'ReturnStatement' &&
          firstBodyStatement.argument.type === config.type
          ? checkIdentity(firstParam, firstBodyStatement.argument)
          : false
      default:
        return false
    }
  }
}

function isFunctionExpression(node) {
  return (
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  )
}

function getFirstParamName(node) {
  const firstParam = node.params[0]
  return firstParam && firstParam.type === 'Identifier' ? firstParam.name : null
}

function getBodyValueName(node) {
  const body = node.body || {}
  if (body.type === 'Identifier') {
    return body.name
  }
  if (body.type === 'BlockStatement') {
    const firstBodyStatement = body.body[0] || { type: '', argument: {} }
    return (firstBodyStatement.type === 'ReturnStatement' ||
      firstBodyStatement.type === 'ThrowStatement') &&
      firstBodyStatement.argument.type === 'Identifier'
      ? firstBodyStatement.argument.name
      : null
  }
  return null
}

function isIdentityFunction(node) {
  if (node.params.length === 1) {
    const firstParam = node.params[0]
    switch (firstParam.type) {
      case 'Identifier':
        return getFirstParamName(node) === getBodyValueName(node)
      case 'ObjectPattern':
        return checkObjectPatternIdentity(firstParam, node.body)
      case 'ArrayPattern':
        return checkArrayPatternIdentity(firstParam, node.body)
      default:
        return false
    }
  }
  return false
}

module.exports = {
  meta: {
    docs: {
      url: getDocsUrl('no-identity-handlers')
    }
  },
  create(context) {
    function checkIdentity(node) {
      if (node && isFunctionExpression(node) && isIdentityFunction(node)) {
        context.report({
          node,
          message: 'No identity handlers'
        })
      }
    }

    return {
      CallExpression(node) {
        if (!isPromise(node)) {
          return
        }

        switch (node.callee.property.name) {
          case 'then':
            checkIdentity(node.arguments[0])
            checkIdentity(node.arguments[1])
            break
          case 'catch':
            checkIdentity(node.arguments[0])
            break
          default:
            break
        }
      }
    }
  }
}
