module.exports = {
  rules: {
    'param-names': require('./rules/param-names'),
    'always-return': require('./rules/always-return'),
    'catch-or-return': require('./rules/catch-or-return'),
    'no-native': require('./rules/no-native')
  },
  rulesConfig: {
    'param-names': 1,
    'always-return': 1,
    'no-native': 0,
    'catch-or-return': 1
  }
}
