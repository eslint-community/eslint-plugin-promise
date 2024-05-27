'use strict'

const rule = require('../rules/no-nesting')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

const errorMessage = 'Avoid nesting promises.'

ruleTester.run('no-nesting', rule, {
  valid: [
    // resolve and reject are sometimes okay
    'Promise.resolve(4).then(function(x) { return x })',
    'Promise.reject(4).then(function(x) { return x })',
    'Promise.resolve(4).then(function() {})',
    'Promise.reject(4).then(function() {})',

    // throw and return are fine
    'doThing().then(function() { return 4 })',
    'doThing().then(function() { throw 4 })',
    'doThing().then(null, function() { return 4 })',
    'doThing().then(null, function() { throw 4 })',
    'doThing().catch(null, function() { return 4 })',
    'doThing().catch(null, function() { throw 4 })',

    // arrow functions and other things
    'doThing().then(() => 4)',
    'doThing().then(() => { throw 4 })',
    'doThing().then(()=>{}, () => 4)',
    'doThing().then(()=>{}, () => { throw 4 })',
    'doThing().catch(() => 4)',
    'doThing().catch(() => { throw 4 })',

    // random functions and callback methods
    'var x = function() { return Promise.resolve(4) }',
    'function y() { return Promise.resolve(4) }',
    'function then() { return Promise.reject() }',
    'doThing(function(x) { return Promise.reject(x) })',

    // this should be allowed basically, we're mostly raging against using then()
    'doThing().then(function() { return Promise.all([a,b,c]) })',
    'doThing().then(function() { return Promise.resolve(4) })',
    'doThing().then(() => Promise.resolve(4))',
    'doThing().then(() => Promise.all([a]))',

    // references vars in closure
    `doThing()
      .then(a => getB(a)
        .then(b => getC(a, b))
      )`,
    `doThing()
      .then(a => {
        const c = a * 2;
        return getB(c).then(b => getC(c, b))
      })`,
  ],

  invalid: [
    {
      code: 'doThing().then(function() { a.then() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(function() { b.catch() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(function() { return a.then() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(function() { return b.catch() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(() => { a.then() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(() => { b.catch() })',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(() => a.then())',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'doThing().then(() => b.catch())',
      errors: [{ message: errorMessage }],
    },
    // references vars in closure
    {
      code: `
      doThing()
        .then(a => getB(a)
          .then(b => getC(b))
        )`,
      errors: [{ message: errorMessage, line: 4 }],
    },
    {
      code: `
      doThing()
        .then(a => getB(a)
          .then(b => getC(a, b)
            .then(c => getD(a, c))
          )
        )`,
      errors: [{ message: errorMessage, line: 5 }],
    },
  ],
})
