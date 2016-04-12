module.exports = function (context) {
  return {
    CallExpression: function (node) {
      var func

      if (node.callee.type !== 'MemberExpression') {
        return
      }

      if (node.callee.property && node.callee.property.name === 'then') {
        func = node.arguments[1]
      } else if (node.callee.property && node.callee.property.name === 'catch') {
        func = node.arguments[0]
      }

      if (!func) {
        return
      }

      var body
      if (func.type === 'FunctionExpression') {
        body = func.body.body
      } else if (func.type === 'ArrowFunctionExpression') {
        if (func.body.type === 'BlockStatement') {
          body = func.body.body
        } else {
          // We're returning via short-hand arrow syntax
          // () => returnValue
          return
        }
      } else {
        // We aren't dealing with a function expression so can't
        // do too much here :(
        return
      }

      var foundReturnOrThrow
      var bodyLen = body.length
      for (var i = 0; i < bodyLen; ++i) {
        var funcNode = body[i]
        if (
          funcNode.type === 'ThrowStatement' ||
          funcNode.type === 'ReturnStatement'
        ) {
          foundReturnOrThrow = funcNode
          break
        }
      }

      if (!foundReturnOrThrow) {
        context.report(func, 'Should rethrow errors or handle by returning some value when catching within a Promise!')
      }
    }
  }
}
