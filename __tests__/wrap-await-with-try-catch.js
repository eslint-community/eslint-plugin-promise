'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../rules/wrap-await-with-try-catch')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8
  }
})

const message = '"await"s must be wrapped with a try/catch statement.'

ruleTester.run('wrap-await-with-try-catch', rule, {
  valid: [
    `async function test() { 
        try {  
            await doSomething()
        }
        catch(ex){
            console.log(ex)
        }
    }`,
    `async function test() { 
        try {  
            throw Error
        }
        catch(ex0){
            try {
                await doSomething()
            }
            catch(ex1) {
                console.log(ex1)
            }
        }
    }`
  ],
  invalid: [
    {
      code: 'async function hi() { await doSomething() }',
      errors: [{ message }]
    },
    {
      code: `async function test() { 
            try {  
                await doSomething()
            }
            finally {
                console.log("ok.")
            }
        }`,
      errors: [{ message }]
    },
    {
      code: `async function test() { 
            try {  
                throw Error
            }
            catch (ex) {
                await doSomethingOther()
            }
        }`,
      errors: [{ message }]
    }
  ]
})
