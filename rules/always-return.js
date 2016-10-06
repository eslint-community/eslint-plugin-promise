function isFunctionWithBlockStatement (node) {
  if (node.type === 'FunctionExpression') {
    return true
  }
  if (node.type === 'ArrowFunctionExpression') {
    return node.body.type === 'BlockStatement'
  }
  return false
}

function isThenExpression (node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property.name === 'then'
  )
}

function isInlineThenFunctionExpression (node) {
  return (
    isFunctionWithBlockStatement(node) &&
    isThenExpression(node.parent)
  )
}

function includes (arr, val) {
  return arr.indexOf(val) !== -1
}

function last (arr) {
  return arr[arr.length - 1]
}

module.exports = {
  create: function (context) {
    var funcInfoStack = []
    var CPSIDStack = []

    function isEveryBranchReturning (funcInfo) {
      // We need to check noCurrentCPSIsOnTheCPSStack because of what
      // seems like a bug in eslint where 'FunctionExpression:exit' events occur
      // before all of their constituent codePathSegments have fired their
      // 'onCodePathSegmentEnd' events
      var currentIDs = funcInfo.codePath.currentSegments.map(x => x.id)
      var noCurrentCPSIsOnTheCPSStack = !currentIDs.some((id) => includes(CPSIDStack, id))

      var finalIDs = funcInfo.codePath.finalSegments.map(x => x.id)
      var everyFinalCPSIsReturning = finalIDs.every((id) => includes(funcInfo.explicitlyReturningCPSIDs, id))

      return noCurrentCPSIsOnTheCPSStack && everyFinalCPSIsReturning
    }

    function onFunctionExpressionExit (node) {
      if (!isInlineThenFunctionExpression(node)) {
        return
      }

      var funcInfo = last(funcInfoStack)
      if (!isEveryBranchReturning(funcInfo)) {
        context.report(node, 'Each then() should return a value or throw')
      }
    }

    function markCurrentCodePathSegmentAsReturning () {
      var funcInfo = last(funcInfoStack)
      var currentCPSID = last(CPSIDStack)
      funcInfo.explicitlyReturningCPSIDs.push(currentCPSID)
    }

    return {
      onCodePathStart: function (codePath, node) {
        funcInfoStack.push({
          codePath: codePath,
          explicitlyReturningCPSIDs: []
        })
      },

      onCodePathEnd: function (codePath, node) {
        funcInfoStack.pop()
      },

      onCodePathSegmentEnd: function (segment, node) {
        CPSIDStack.pop()
      },
      onCodePathSegmentStart: function (segment, node) {
        CPSIDStack.push(segment.id)
      },

      ReturnStatement: markCurrentCodePathSegmentAsReturning,
      ThrowStatement: markCurrentCodePathSegmentAsReturning,
      'FunctionExpression:exit': onFunctionExpressionExit,
      'ArrowFunctionExpression:exit': onFunctionExpressionExit
    }
  }
}
