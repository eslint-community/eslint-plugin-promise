/**
 * @fileoverview Helpers for tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */
'use strict'
const { version } = require('eslint/package.json')
const { RuleTester } = require('eslint')

const majorVersion = Number.parseInt(version.split('.')[0], 10)

exports.RuleTester = function (config = {}) {
  if (majorVersion <= 8) {
    return new RuleTester(config)
  }

  if (config.languageOptions == null) {
    config.languageOptions = {}
  }
  if (config.languageOptions.ecmaVersion == null) {
    config.languageOptions.ecmaVersion = 2020
  }
  if (config.parserOptions) {
    Object.assign(config.languageOptions, config.parserOptions)
  }

  if (config.parser) {
    config.languageOptions.parser = require(config.parser)
  }

  delete config.parserOptions
  delete config.parser

  return new RuleTester(config)
}
