module.exports = {
  rules: {
    'param-names': require('./rules/param-names'),
    'no-return-wrap': require('./rules/no-return-wrap'),
    'always-return': require('./rules/always-return'),
    'catch-or-return': require('./rules/catch-or-return'),
    'prefer-await-to-callbacks': require('./rules/prefer-await-to-callbacks'),
    'prefer-await-to-then': require('./rules/prefer-await-to-then'),
    'no-native': require('./rules/no-native'),
    'no-callback-in-promise': require('./rules/no-callback-in-promise'),
    'no-promise-in-callback': require('./rules/no-promise-in-callback'),
    'no-nesting': require('./rules/no-nesting'),
    'avoid-new': require('./rules/avoid-new')
  },
  rulesConfig: {
    'param-names': 1,
    'always-return': 1,
    'no-return-wrap': 1,
    'no-native': 0,
    'catch-or-return': 1
  }
}
