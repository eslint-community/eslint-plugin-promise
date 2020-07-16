/**
 * Rule: wrap-await-with-try-catch
 */

'use strict'

module.exports = {
    rules: {
        "wrap-await-with-try-catch": {
            create: function(context) {
                function isAwaitHandled() {
                    var ancestors = context.getAncestors();
                    var handledInOrder = [];

                    ancestors.forEach((ancestor) => {
                        if (ancestor.type === "TryStatement") {
                            handledInOrder.push({name: "try", node: ancestor, relatedTry: ancestor});
                        }
                        else if (ancestor.type === "CatchClause") {
                            handledInOrder.push({name: "catch", node: ancestor, relatedTry: ancestor.parent});
                        }
                        else if (ancestor.type === "BlockStatement" && ancestor.parent.finalizer === ancestor) {
                            handledInOrder.push({name: "finally", node: ancestor, relatedTry: ancestor.parent});
                        }
                        else if (ancestor.type === "FunctionExpression" || ancestor.type === "FunctionDeclaration") {
                            // clear the current parents, we are in a new function
                            handledInOrder = [];
                        }
                    });

                    if (handledInOrder.length === 0) {
                        return false;
                    }

                    var lastItem = handledInOrder[handledInOrder.length - 1];

                    while (handledInOrder.length > 0 && !(lastItem.name === "try" && lastItem.node.handler)) {
                        var tryToBeDeleted = lastItem.relatedTry;

                        while (handledInOrder.length > 0 && lastItem.relatedTry == tryToBeDeleted) {
                            handledInOrder.pop();
                            lastItem = handledInOrder[handledInOrder.length - 1];
                        }
                    }

                    return handledInOrder.length > 0;
                }

                return {
                    AwaitExpression(node) {
                        if (isAwaitHandled()) {
                            return;
                        }

                        context.report({
                            node: node,
                            message: '"await"s must be wrapped with a try/catch statement.'
                        });
                    }
                };
            }
        }
    }
};
