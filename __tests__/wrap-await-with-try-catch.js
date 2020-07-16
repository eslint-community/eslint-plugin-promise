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
            errorHandler(ex)
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
                errorHandler(ex1)
            }
        }
    }`,
    `async function test() { 
        try {
            (async function innerFn() {
                try {
                    await doSomething()
                }
                catch (ex) {
                    errorHandler(ex)
                }
            })()
        }
        catch (ex) {
            errorHandler(ex)
        }
    }`,
    `var foo = async () => {
        try {
             await fetch();
        } catch (error) {
             errorHandler(error);
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
                errorHandler("ok.")
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
    },
    {
      code: `async function test() { 
            try {
                (async function innerFn() {
                    await doSomething()
                })()
            }
            catch (ex) {
                errorHandler(ex)
            }
        }`,
      errors: [{ message }]
    },
    {
      code: `var foo = async () => {
        await fetch();
    }`,
      errors: [{ message }]
    }
  ]
})
