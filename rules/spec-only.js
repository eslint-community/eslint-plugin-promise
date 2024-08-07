'use strict'

const PROMISE_STATICS = require('./lib/promise-statics')
const getDocsUrl = require('./lib/get-docs-url')

const PROMISE_INSTANCE_METHODS = new Set(['then', 'catch', 'finally'])

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
          (!node.computed || node.property.type === 'Literal') &&
          node.object.name === 'Promise' &&
          ((node.property.name && !PROMISE_STATICS.has(node.property.name)) ||
            (node.property.value &&
              !PROMISE_STATICS.has(node.property.value))) &&
          (node.property.name !== 'prototype' ||
            (!PROMISE_INSTANCE_METHODS.has(node?.parent?.property?.name) &&
              !allowedMethods.includes(node?.parent?.property?.name))) &&
          !allowedMethods.includes(node.property.name ?? node.property.value)
        ) {
          context.report({
            node,
            messageId: 'avoidNonStandard',
            data: { name: node.property.name ?? node.property.value },
          })
        }
      },
    }
  },
}
