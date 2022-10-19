'use strict'

const rule = require('../rules/no-multiple-resolved')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
  },
})

ruleTester.run('no-multiple-resolved', rule, {
  valid: [
    `new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
        } else {
          resolve(value)
        }
      })
    })`,
    `new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      } else {
        resolve(value)
      }
    })`,
    `new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
          return
        }
        resolve(value)
      })
    })`,
    `new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
        }
        if (!error) {
          resolve(value)
        }
      })
    })`,
    `new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
        }
        if (error) {
          return
        }
        resolve(value)
      })
    })`,
    `
    new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
        }
        if (!error) {
          // process
        } else {
          // process
        }
        if(!error) {
          resolve(value)
        }
      })
    })`,
    `
    new Promise((resolve, reject) => {
      fn((error, value) => {
        if (error) {
          reject(error)
          return
        }
        if (!error) {
          // process
        } else {
          // process
        }

        resolve(value)
      })
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        await foo();
        resolve();
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        const r = await foo();
        resolve(r);
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        const r = await foo();
        resolve(r());
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        const r = await foo();
        resolve(r.foo);
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        const r = await foo();
        resolve(new r());
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise(async (resolve, reject) => {
      try {
        const r = await foo();
        resolve(import(r));
      } catch (error) {
        reject(error);
      }
    })`,
    `new Promise((resolve, reject) => {
      fn(async function * () {
        try {
          const r = await foo();
          resolve(yield r);
        } catch (error) {
          reject(error);
        }
      })
    })`,
    `new Promise(async (resolve, reject) => {
      let a;
      try {
        const r = await foo();
        resolve();
        if(r) return;
      } catch (error) {
        reject(error);
      }
    })`,
  ],

  invalid: [
    {
      code: `
      new Promise((resolve, reject) => {
        fn((error, value) => {
          if (error) {
            reject(error)
          }

          resolve(value)
        })
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        if (error) {
          reject(error)
        }

        resolve(value)
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 4.',
          line: 7,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        reject(error)
        resolve(value)
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is already resolved on line 3.',
          line: 4,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        fn((error, value) => {
          if (error) {
            reject(error)
          }
          if (!error) {
            // process
          } else {
            // process
          }

          resolve(value)
        })
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 13,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        fn((error, value) => {
          if (error) {
            if (foo) {
              if (bar) reject(error)
            }
          }

          resolve(value)
        })
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 6.',
          line: 10,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        fn((error, value) => {
          if (error) {
            reject(error)
          } else {
            return
          }

          resolve(value)
        })
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is already resolved on line 5.',
          line: 10,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        if(foo) {
          if (error) {
            reject(error)
          } else {
            return
          }
          resolve(value)
        }

        resolve(value)
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is already resolved on line 5.',
          line: 9,
        },
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 9.',
          line: 12,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        if (foo) {
          reject(error)
        } else {
          resolve(value)
        }
        if(bar) {
          resolve(value)
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is already resolved on line 4.',
          line: 9,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        while (error) {
          reject(error)
        }
        resolve(value)
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 4.',
          line: 6,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        try {
          reject(error)
        } finally {
          resolve(value)
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is already resolved on line 4.',
          line: 6,
        },
      ],
    },
    {
      code: `
      new Promise((resolve, reject) => {
        try {
          if (error) {
            reject(error)
          }
        } finally {
          resolve(value)
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
    {
      code: `new Promise(async (resolve, reject) => {
        try {
          const r = await foo();
          resolve();
          r();
        } catch (error) {
          reject(error);
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 4.',
          line: 7,
        },
      ],
    },
    {
      code: `new Promise(async (resolve, reject) => {
        let a;
        try {
          const r = await foo();
          resolve();
          a = r.foo;
        } catch (error) {
          reject(error);
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
    {
      code: `new Promise(async (resolve, reject) => {
        let a;
        try {
          const r = await foo();
          resolve();
          a = new r();
        } catch (error) {
          reject(error);
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
    {
      code: `new Promise(async (resolve, reject) => {
        let a;
        try {
          const r = await foo();
          resolve();
          import(r);
        } catch (error) {
          reject(error);
        }
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
    {
      code: `new Promise((resolve, reject) => {
        fn(async function * () {
          try {
            const r = await foo();
            resolve();
            yield r;
          } catch (error) {
            reject(error);
          }
        })
      })`,
      errors: [
        {
          message:
            'Promise should not be resolved multiple times. Promise is potentially resolved on line 5.',
          line: 8,
        },
      ],
    },
  ],
})
