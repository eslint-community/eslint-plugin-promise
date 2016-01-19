module.exports = {
  rules: {
    'param-names': require('./rules/param-names'),
    'always-return': require('./rules/always-return'),
    'always-catch': require('./rules/always-catch')
  },
  rulesConfig: {
    'param-names': 1,
    'always-return': 1,
    'always-catch': 1
  }
}
