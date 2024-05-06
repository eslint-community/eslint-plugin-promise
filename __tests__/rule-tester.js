/**
 * @fileoverview Helpers for tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */
'use strict'
const { version } = require('eslint/package.json')
const { RuleTester } = require('eslint')
const globals = require('globals')

const majorVersion = Number.parseInt(version.split('.')[0], 10)

function convertConfig(config) {
  if (config instanceof Object === false) {
    return config
  }

  if (config.languageOptions == null) {
    config.languageOptions = {}
  }

  if (config.parserOptions) {
    Object.assign(config.languageOptions, config.parserOptions)
  }

  if (typeof config.parser === 'string') {
    config.languageOptions.parser = require(config.parser)
  }

  if (config.globals instanceof Object) {
    config.languageOptions.globals = config.globals
    delete config.globals
  }

  if (config.env instanceof Object) {
    if (config.languageOptions.globals == null) {
      config.languageOptions.globals = {}
    }

    for (const key in config.env) {
      Object.assign(config.languageOptions.globals, globals[key])
    }

    delete config.env
  }

  delete config.parserOptions
  delete config.parser

  return config
}

exports.RuleTester = function (config = {}) {
  if (majorVersion <= 8) {
    return new RuleTester(config)
  }

  const ruleTester = new RuleTester(convertConfig(config))
  const $run = ruleTester.run.bind(ruleTester)
  ruleTester.run = function (name, rule, tests) {
    tests.valid = tests.valid.map(convertConfig)
    tests.invalid = tests.invalid.map(convertConfig)

    $run(name, rule, tests)
  }
  return ruleTester
}
