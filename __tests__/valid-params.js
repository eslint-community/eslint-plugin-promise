'use strict'

const rule = require('../rules/valid-params')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

ruleTester.run('valid-params', rule, {
  valid: [
    // Array literal spreads contribute their known argument counts.
    'Promise.resolve(...[value])',
    'Promise.resolve(...[,])',
    'Promise.resolve(...[[one, two]])',
    'Promise.all(...[iterable])',
    'somePromise().then(...[success, ...[failure]])',
    'Promise.resolve(...[...rest])',
    'Promise.resolve(...[value, ...rest])',
    'Promise.resolve(...[...rest, ...[]])',
    'somePromise().then(...[...[], ...rest])',

    // Spread arguments have an unknown runtime argument count.
    'Promise.resolve(...[])',
    'Promise.resolve(value, ...rest)',
    'Promise.reject(...args, reason)',
    'Promise.all(iterable, ...rest)',
    'Promise.race(...args, iterable)',
    'Promise.allSettled(iterable, ...rest)',
    'Promise.any(...args, iterable)',
    'somePromise().then(success, failure, ...rest)',
    'somePromise().catch(callback, ...rest)',
    'somePromise().finally(...args, callback)',
    'Promise.resolve(value, ...[])',
    'somePromise().then(...[], success, failure)',
    'somePromise().then(...first, ...second, ...third)',

    // valid Promise.resolve()
    'Promise.resolve()',
    'Promise.resolve(1)',
    'Promise.resolve({})',
    'Promise.resolve(referenceToSomething)',

    // valid Promise.reject()
    'Promise.reject()',
    'Promise.reject(1)',
    'Promise.reject({})',
    'Promise.reject(referenceToSomething)',
    'Promise.reject(Error())',

    // valid Promise.race()
    'Promise.race([])',
    'Promise.race(iterable)',
    'Promise.race([one, two, three])',

    // valid Promise.all()
    'Promise.all([])',
    'Promise.all(iterable)',
    'Promise.all([one, two, three])',

    // valid Promise.allSettled()
    'Promise.allSettled([])',
    'Promise.allSettled(iterable)',
    'Promise.allSettled([one, two, three])',

    // valid Promise.any()
    'Promise.any([])',
    'Promise.any(iterable)',
    'Promise.any([one, two, three])',

    // valid Promise.then()
    'somePromise().then(success)',
    'somePromise().then(success, failure)',
    'promiseReference.then(() => {})',
    'promiseReference.then(() => {}, () => {})',

    // valid Promise.catch()
    'somePromise().catch(callback)',
    'somePromise().catch(err => {})',
    'promiseReference.catch(callback)',
    'promiseReference.catch(err => {})',

    // valid Promise.finally()
    'somePromise().finally(callback)',
    'somePromise().finally(() => {})',
    'promiseReference.finally(callback)',
    'promiseReference.finally(() => {})',

    {
      code: `
        somePromise.then(function() {
          return sth();
        }).catch(TypeError, function(e) {
          //
        }).catch(function(e) {
        });
      `,
      options: [
        {
          exclude: ['catch'],
        },
      ],
    },

    // integration test
    `
      Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.reject(Error()),
      ])
        .then(console.log)
        .catch(console.error)
        .finally(console.log)
    `,
  ],
  invalid: [
    {
      code: 'Promise.resolve(value, ...[other])',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received 2',
        },
      ],
    },
    {
      code: 'Promise.all(...[])',
      errors: [
        { message: 'Promise.all() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'somePromise().then(...[])',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 0' },
      ],
    },
    {
      code: 'somePromise().catch(...[...[]])',
      errors: [
        { message: 'Promise.catch() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'Promise.reject(...[one, two])',
      errors: [
        {
          message: 'Promise.reject() requires 0 or 1 arguments, but received 2',
        },
      ],
    },
    {
      code: 'Promise.resolve(...[,,])',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received 2',
        },
      ],
    },
    {
      code: 'somePromise().then(...[success, ...[failure, extra]])',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 3' },
      ],
    },
    {
      code: 'Promise.resolve(...[value, ...rest, other])',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received at least 2',
        },
      ],
    },
    {
      code: 'Promise.resolve(...[...rest, ...[one, two]])',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received at least 2',
        },
      ],
    },

    // Known arguments can exceed the maximum even with a spread.
    {
      code: 'Promise.resolve(value, other, ...rest)',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received at least 2',
        },
      ],
    },
    {
      code: 'somePromise().then(success, ...rest, failure, extra)',
      errors: [
        {
          message:
            'Promise.then() requires 1 or 2 arguments, but received at least 3',
        },
      ],
    },
    {
      code: 'somePromise().catch(...args, callback, extra)',
      errors: [
        {
          message:
            'Promise.catch() requires 1 argument, but received at least 2',
        },
      ],
    },

    // invalid Promise.resolve()
    {
      code: 'Promise.resolve(1, 2)',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received 2',
        },
      ],
    },
    {
      code: 'Promise.resolve({}, function() {}, 1, 2, 3)',
      errors: [
        {
          message:
            'Promise.resolve() requires 0 or 1 arguments, but received 5',
        },
      ],
    },

    // invalid Promise.reject()
    {
      code: 'Promise.reject(1, 2, 3)',
      errors: [
        {
          message: 'Promise.reject() requires 0 or 1 arguments, but received 3',
        },
      ],
    },
    {
      code: 'Promise.reject({}, function() {}, 1, 2)',
      errors: [
        {
          message: 'Promise.reject() requires 0 or 1 arguments, but received 4',
        },
      ],
    },

    // invalid Promise.race()
    {
      code: 'Promise.race(1, 2)',
      errors: [
        { message: 'Promise.race() requires 1 argument, but received 2' },
      ],
    },
    {
      code: 'Promise.race({}, function() {}, 1, 2, 3)',
      errors: [
        { message: 'Promise.race() requires 1 argument, but received 5' },
      ],
    },

    // A spread inside an argument does not change the argument count.
    {
      code: 'Promise.all([...values], other)',
      errors: [
        { message: 'Promise.all() requires 1 argument, but received 2' },
      ],
    },

    // invalid Promise.all()
    {
      code: 'Promise.all(1, 2, 3)',
      errors: [
        { message: 'Promise.all() requires 1 argument, but received 3' },
      ],
    },
    {
      code: 'Promise.all({}, function() {}, 1, 2)',
      errors: [
        { message: 'Promise.all() requires 1 argument, but received 4' },
      ],
    },
    // invalid Promise.allSettled()
    {
      code: 'Promise.allSettled(1, 2, 3)',
      errors: [
        { message: 'Promise.allSettled() requires 1 argument, but received 3' },
      ],
    },
    {
      code: 'Promise.allSettled({}, function() {}, 1, 2)',
      errors: [
        { message: 'Promise.allSettled() requires 1 argument, but received 4' },
      ],
    },
    // invalid Promise.any()
    {
      code: 'Promise.any(1, 2, 3)',
      errors: [
        { message: 'Promise.any() requires 1 argument, but received 3' },
      ],
    },
    {
      code: 'Promise.any({}, function() {}, 1, 2)',
      errors: [
        { message: 'Promise.any() requires 1 argument, but received 4' },
      ],
    },

    // invalid Promise.then()
    {
      code: 'somePromise().then()',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 0' },
      ],
    },
    {
      code: 'somePromise().then(() => {}, () => {}, () => {})',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 3' },
      ],
    },
    {
      code: 'promiseReference.then()',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 0' },
      ],
    },
    {
      code: 'promiseReference.then(() => {}, () => {}, () => {})',
      errors: [
        { message: 'Promise.then() requires 1 or 2 arguments, but received 3' },
      ],
    },

    // invalid Promise.catch()
    {
      code: 'somePromise().catch()',
      errors: [
        { message: 'Promise.catch() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'somePromise().catch(() => {}, () => {})',
      errors: [
        { message: 'Promise.catch() requires 1 argument, but received 2' },
      ],
    },
    {
      code: 'promiseReference.catch()',
      errors: [
        { message: 'Promise.catch() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'promiseReference.catch(() => {}, () => {})',
      errors: [
        { message: 'Promise.catch() requires 1 argument, but received 2' },
      ],
    },

    // invalid Promise.finally()
    {
      code: 'somePromise().finally()',
      errors: [
        { message: 'Promise.finally() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'somePromise().finally(() => {}, () => {})',
      errors: [
        { message: 'Promise.finally() requires 1 argument, but received 2' },
      ],
    },
    {
      code: 'promiseReference.finally()',
      errors: [
        { message: 'Promise.finally() requires 1 argument, but received 0' },
      ],
    },
    {
      code: 'promiseReference.finally(() => {}, () => {})',
      errors: [
        { message: 'Promise.finally() requires 1 argument, but received 2' },
      ],
    },
  ],
})
