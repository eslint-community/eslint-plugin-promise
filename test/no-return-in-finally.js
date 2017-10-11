var RuleTester = require('eslint').RuleTester
var rule = require('../rules/no-return-in-finally')
var ruleTester = new RuleTester()
var message = 'No return in finally'

ruleTester.run('no-return-in-finally', rule, {
  valid: [
    { code: 'Promise.resolve(1).finally(() => { console.log(2) })', parserOptions: { ecmaVersion: 6 } },
    { code: 'Promise.reject(4).finally(() => { console.log(2) })', parserOptions: { ecmaVersion: 6 } },
    { code: 'Promise.reject(4).finally(() => {})', parserOptions: { ecmaVersion: 6 } },
    { code: 'myPromise.finally(() => {});', parserOptions: { ecmaVersion: 6 } },
    { code: 'Promise.resolve(1).finally(function () { })' }
  ],
  invalid: [
    { code: 'Promise.resolve(1).finally(() => { return 2 })', parserOptions: { ecmaVersion: 6 }, errors: [ { message: message } ] },
    { code: 'Promise.reject(0).finally(() => { return 2 })', parserOptions: { ecmaVersion: 6 }, errors: [ { message: message } ] },
    { code: 'myPromise.finally(() => { return 2 });', parserOptions: { ecmaVersion: 6 }, errors: [ { message: message } ] },
    { code: 'Promise.resolve(1).finally(function () { return 2 })', errors: [ { message: message } ] }
  ]
})
