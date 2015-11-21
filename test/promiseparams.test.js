"use strict";

var rule = require("../promiseparams"),
    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("promiseparams", rule, {
    valid: [
        "new Promise(function(resolve, reject) { })",
    ],

    invalid: [
        {
            code: "new Promise(function(reject, resolve) { })",
            errors: [ { message: "Promise constructor parameters must be named resolve, reject" } ]
        },
        {
            code: "new Promise(function(resolve, rej) { })",
            errors: [ { message: "Promise constructor parameters must be named resolve, reject" } ]
        }
    ]
});