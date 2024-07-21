'use strict'

const rule = require('../rules/always-return')
const { RuleTester } = require('./rule-tester')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 11,
  },
})

const message = 'Each then() should return a value or throw'

ruleTester.run('always-return', rule, {
  valid: [
    'hey.then(x => x)',
    'hey.then(x => ({}))',
    'hey.then(x => { return; })',
    'hey.then(x => { return x ? x.id : null })',
    'hey.then(x => { return x * 10 })',
    'hey.then(x => { process.exit(0); })',
    'hey.then(x => { process.abort(); })',
    'hey.then(function() { return 42; })',
    'hey.then(function() { return new Promise(); })',
    'hey.then(function() { return "x"; }).then(doSomethingWicked)',
    'hey.then(x => x).then(function() { return "3" })',
    'hey.then(function() { throw new Error("msg"); })',
    'hey.then(function(x) { if (!x) { throw new Error("no x"); } return x; })',
    'hey.then(function(x) { if (x) { return x; } throw new Error("no x"); })',
    'hey.then(function(x) { if (x) { process.exit(0); } throw new Error("no x"); })',
    'hey.then(function(x) { if (x) { process.abort(); } throw new Error("no x"); })',
    'hey.then(x => { throw new Error("msg"); })',
    'hey.then(x => { if (!x) { throw new Error("no x"); } return x; })',
    'hey.then(x => { if (x) { return x; } throw new Error("no x"); })',
    'hey.then(x => { var f = function() { }; return f; })',
    'hey.then(x => { if (x) { return x; } else { return x; } })',
    'hey.then(x => { return x; var y = "unreachable"; })',
    'hey.then(x => { return x; return "unreachable"; })',
    'hey.then(x => { return; }, err=>{ log(err); })',
    'hey.then(x => { return x && x(); }, err=>{ log(err); })',
    'hey.then(x => { return x.y || x(); }, err=>{ log(err); })',
    `hey.then(x => {
        return anotherFunc({
          nested: {
            one: x === 1 ? 1 : 0,
            two: x === 2 ? 1 : 0
          }
        })
      })`,
    `hey.then(({x, y}) => {
        if (y) {
          throw new Error(x || y)
        }
        return x
      })`,
    {
      code: 'hey.then(x => { console.log(x) })',
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: 'if(foo) { hey.then(x => { console.log(x) }) }',
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: 'void hey.then(x => { console.log(x) })',
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `
      async function foo() {
        await hey.then(x => { console.log(x) })
      }`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `hey?.then(x => { console.log(x) })`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `foo = (hey.then(x => { console.log(x) }), 42)`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `(42, hey.then(x => { console.log(x) }))`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `
      hey
        .then(x => { console.log(x) })
        .catch(e => console.error(e))`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `
      hey
        .then(x => { console.log(x) })
        .catch(e => console.error(e))
        .finally(() => console.error('end'))`,
      options: [{ ignoreLastCallback: true }],
    },
    {
      code: `
      hey
        .then(x => { console.log(x) })
        .finally(() => console.error('end'))`,
      options: [{ ignoreLastCallback: true }],
    },
  ],

  invalid: [
    {
      code: 'hey.then(x => {})',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { })',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { }).then(x)',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { }).then(function() { })',
      errors: [{ message }, { message }],
    },
    {
      code: 'hey.then(function() { return; }).then(function() { })',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { doSomethingWicked(); })',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { if (x) { return x; } })',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { if (x) { return x; } else { }})',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { if (x) { } else { return x; }})',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { if (x) { process.chdir(); } else { return x; }})',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function() { if (x) { return you.then(function() { return x; }); } })',
      errors: [{ message }],
    },
    {
      code: 'hey.then( x => { x ? x.id : null })',
      errors: [{ message }],
    },
    {
      code: 'hey.then(function(x) { x ? x.id : null })',
      errors: [{ message }],
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
      errors: [{ message }],
    },
    {
      code: `
      hey.then(({x, y}) => {
        if (y) {
          throw new Error(x || y)
        }
      })`,
      errors: [{ message }],
    },
    {
      code: `
      hey.then(({x, y}) => {
        if (y) {
          return x
        }
      })`,
      errors: [{ message }],
    },
    {
      code: `
      hey
        .then(function(x) { console.log(x) /* missing return here */ })
        .then(function(y) { console.log(y) /* no error here */ })`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message, line: 3 }],
    },
    {
      code: `const foo = hey.then(function(x) {});`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message }],
    },
    {
      code: `
      function foo() {
        return hey.then(function(x) {});
      }`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message }],
    },
    {
      code: `
      async function foo() {
        return await hey.then(x => { console.log(x) })
      }`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message }],
    },
    {
      code: `const foo = hey?.then(x => { console.log(x) })`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message }],
    },
    {
      code: `const foo = (42, hey.then(x => { console.log(x) }))`,
      options: [{ ignoreLastCallback: true }],
      errors: [{ message }],
    },
  ],
})
