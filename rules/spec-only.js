'use strict'

const PROMISE_STATICS = require('./lib/promise-statics')
const getDocsUrl = require('./lib/get-docs-url')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow use of non-standard Promise static methods.',
      url: getDocsUrl('spec-only'),
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedMethods: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidNonStandard: "Avoid using non-standard 'Promise.{{ name }}'",
    },
  },
  create(context) {
    const { allowedMethods = [] } = context.options[0] || {}

    return {
      MemberExpression(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'Promise' &&
          !(node.property.name in PROMISE_STATICS) &&
          !allowedMethods.includes(node.property.name)
        ) {
          context.report({
            node,
            messageId: 'avoidNonStandard',
            data: { name: node.property.name },
          })
        }
      },
    }
  },
}
