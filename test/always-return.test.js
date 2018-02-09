'use strict'

var rule = require('../rules/always-return')
var RuleTester = require('eslint').RuleTester
var message = 'Each then() should return a value or throw'
var parserOptions = { ecmaVersion: 6 }
var ruleTester = new RuleTester()
ruleTester.run('always-return', rule, {
  valid: [
    { code: 'hey.then(x => x)', parserOptions: parserOptions },
    { code: 'hey.then(x => ({}))', parserOptions: parserOptions },
    { code: 'hey.then(x => { return; })', parserOptions: parserOptions },
    {
      code: 'hey.then(x => { return x ? x.id : null })',
      parserOptions: parserOptions
    },
    { code: 'hey.then(x => { return x * 10 })', parserOptions: parserOptions },
    {
      code: 'hey.then(function() { return 42; })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(function() { return new Promise(); })',
      parserOptions: parserOptions
    },
    { code: 'hey.then(function() { return "x"; }).then(doSomethingWicked)' },
    {
      code: 'hey.then(x => x).then(function() { return "3" })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(function() { throw new Error("msg"); })',
      parserOptions: parserOptions
    },
    {
      code:
        'hey.then(function(x) { if (!x) { throw new Error("no x"); } return x; })',
      parserOptions: parserOptions
    },
    {
      code:
        'hey.then(function(x) { if (x) { return x; } throw new Error("no x"); })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { throw new Error("msg"); })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { if (!x) { throw new Error("no x"); } return x; })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { if (x) { return x; } throw new Error("no x"); })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { var f = function() { }; return f; })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { if (x) { return x; } else { return x; } })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { return x; var y = "unreachable"; })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { return x; return "unreachable"; })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { return; }, err=>{ log(err); })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { return x && x(); }, err=>{ log(err); })',
      parserOptions: parserOptions
    },
    {
      code: 'hey.then(x => { return x.y || x(); }, err=>{ log(err); })',
      parserOptions: parserOptions
    },
    {
      code: `hey.then(x => {
        return anotherFunc({
          nested: {
            one: x === 1 ? 1 : 0,
            two: x === 2 ? 1 : 0
          }
        })
      })`,
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: 'hey.then(x => {})',
      parserOptions: parserOptions,
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { })',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { }).then(x)',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { }).then(function() { })',
      errors: [{ message: message }, { message: message }]
    },
    {
      code: 'hey.then(function() { return; }).then(function() { })',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { doSomethingWicked(); })',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { if (x) { return x; } })',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { if (x) { return x; } else { }})',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function() { if (x) { } else { return x; }})',
      errors: [{ message: message }]
    },
    {
      code:
        'hey.then(function() { if (x) { return you.then(function() { return x; }); } })',
      errors: [{ message: message }]
    },
    {
      code: 'hey.then( x => { x ? x.id : null })',
      parserOptions: parserOptions,
      errors: [{ message: message }]
    },
    {
      code: 'hey.then(function(x) { x ? x.id : null })',
      errors: [{ message: message }]
    },
    {
      code: `(function() {
        return hey.then(x => {
          anotherFunc({
            nested: {
              one: x === 1 ? 1 : 0,
              two: x === 2 ? 1 : 0
            }
          })
        })
      })()`,
      parserOptions: parserOptions,
      errors: [{ message: message }]
    }
  ]
})
