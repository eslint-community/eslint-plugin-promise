'use strict'

const rule = require('../rules/no-callback-in-promise')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

const errorMessage = 'Avoid calling back inside of a promise.'

ruleTester.run('no-callback-in-promise', rule, {
  valid: [
    'function thing(cb) { cb() }',
    'doSomething(function(err) { cb(err) })',
    'function thing(callback) { callback() }',
    'doSomething(function(err) { callback(err) })',

    // Support safe callbacks (#220)
    'whatever.then((err) => { process.nextTick(() => cb()) })',
    'whatever.then((err) => { setImmediate(() => cb()) })',
    'whatever.then((err) => setImmediate(() => cb()))',
    'whatever.then((err) => process.nextTick(() => cb()))',
    'whatever.then((err) => process.nextTick(cb))',
    'whatever.then((err) => setImmediate(cb))',

    // arrow functions and other things
    'let thing = (cb) => cb()',
    'doSomething(err => cb(err))',

    // exceptions test
    {
      code: 'a.then(() => next())',
      options: [{ exceptions: ['next'] }],
    },
    {
      code: 'a.then(() => next()).catch((err) => next(err))',
      options: [{ exceptions: ['next'] }],
    },
    {
      code: 'a.then(next)',
      options: [{ exceptions: ['next'] }],
    },
    {
      code: 'a.then(next).catch(next)',
      options: [{ exceptions: ['next'] }],
    },

    // #572
    `
        while (!(step = call(next, iterator)).done) {
          if (result !== undefined) break;
        }
      `,
  ],

  invalid: [
    {
      code: 'a.then(cb)',
      errors: [{ message: errorMessage, column: 8 }],
    },
    {
      code: 'a.then(() => cb())',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'a.then(function(err) { cb(err) })',
      errors: [{ message: errorMessage, column: 24 }],
    },
    {
      code: 'a.then(function(data) { cb(data) }, function(err) { cb(err) })',
      errors: [
        { column: 25, message: errorMessage },
        { column: 53, message: errorMessage },
      ],
    },
    {
      code: 'a.catch(function(err) { cb(err) })',
      errors: [{ message: errorMessage }],
    },

    // callback should also complain
    {
      code: 'a.then(callback)',
      errors: [{ message: errorMessage, column: 8 }],
    },
    {
      code: 'a.then(() => callback())',
      errors: [{ message: errorMessage }],
    },
    {
      code: 'a.then(function(err) { callback(err) })',
      errors: [{ message: errorMessage, column: 24 }],
    },
    {
      code: 'a.then(function(data) { callback(data) }, function(err) { callback(err) })',
      errors: [
        { message: errorMessage },
        { column: 59, message: errorMessage },
      ],
    },
    {
      code: 'a.catch(function(err) { callback(err) })',
      errors: [{ message: errorMessage }],
    },

    // #167
    {
      code: `
        function wait (callback) {
          return Promise.resolve()
            .then(() => {
              setTimeout(callback);
            });
        }
      `,
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: `
        function wait (callback) {
          return Promise.resolve()
            .then(() => {
              setTimeout(() => callback());
            });
        }
      `,
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },

    {
      code: 'whatever.then((err) => { process.nextTick(() => cb()) })',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: 'whatever.then((err) => { setImmediate(() => cb()) })',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: 'whatever.then((err) => setImmediate(() => cb()))',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: 'whatever.then((err) => process.nextTick(() => cb()))',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: 'whatever.then((err) => process.nextTick(cb))',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
    {
      code: 'whatever.then((err) => setImmediate(cb))',
      errors: [{ message: errorMessage }],
      options: [
        {
          timeoutsErr: true,
        },
      ],
    },
  ],
})
