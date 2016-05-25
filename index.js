module.exports = {
  rules: {
    'param-names': require('./rules/param-names'),
    'always-return': require('./rules/always-return'),
    'always-catch': require('./rules/always-catch'),
    'catch-or-return': require('./rules/catch-or-return'),
    'always-rethrow-or-return': require('./rules/always-rethrow-or-return')
  },
  rulesConfig: {
    'param-names': 1,
    'always-return': 1,
    'always-catch': 1,
    'catch-or-return': 1,
    'always-rethrow-or-return': 1
  }
}
