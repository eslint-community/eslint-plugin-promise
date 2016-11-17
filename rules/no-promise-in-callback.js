/**
 * Rule: no-promise-in-callback
 * Discourage using promises inside of callbacks.
 */

var isPromise = require('./lib/is-promise')
var isInsideCallback = require('./lib/is-inside-callback')

module.exports = function (context) {
  return {
    CallExpression: function (node) {
      if (!isPromise(node)) return
      if (context.getAncestors().some(isInsideCallback)) {
        context.report(node, 'Avoid using promises inside of callbacks.')
      }
    }
  }
}
