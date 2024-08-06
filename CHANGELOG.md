# Changelog

## [7.1.0](https://github.com/eslint-community/eslint-plugin-promise/compare/v7.0.0...v7.1.0) (2024-08-06)


### 🌟 Features

* **`catch-or-return`, `prefer-await-to-then`:** do not report Cypress commands ([#495](https://github.com/eslint-community/eslint-plugin-promise/issues/495)) ([943f162](https://github.com/eslint-community/eslint-plugin-promise/commit/943f16290f11af9717612e079646802e22310290))
* **`prefer-await-to-then`:** ignore constructor scope unless with `strict` option ([#496](https://github.com/eslint-community/eslint-plugin-promise/issues/496)) ([7bffb7a](https://github.com/eslint-community/eslint-plugin-promise/commit/7bffb7a666ed74a876ba3a6c482c36ea6f9d6d07))
* new rule `spec-only` to check for non-spec Promise methods ([#502](https://github.com/eslint-community/eslint-plugin-promise/issues/502)) ([d6e9de1](https://github.com/eslint-community/eslint-plugin-promise/commit/d6e9de1f9c81194b775484ed0299dc5cc4898684))


### 📚 Documentation

* fixes the CI readme badge ([#511](https://github.com/eslint-community/eslint-plugin-promise/issues/511)) ([030a3be](https://github.com/eslint-community/eslint-plugin-promise/commit/030a3be890d371381ef13258806f97ec62d6b4fd))
* supply missing docs ([#503](https://github.com/eslint-community/eslint-plugin-promise/issues/503)) ([602d825](https://github.com/eslint-community/eslint-plugin-promise/commit/602d8254871e46c9d1808ee1a3a2c48cb7493334))


### 🧹 Chores

* bump dev dependencies ([#483](https://github.com/eslint-community/eslint-plugin-promise/issues/483)) ([197ae4e](https://github.com/eslint-community/eslint-plugin-promise/commit/197ae4eb4f05f34c54189102871d969379595a54))
* **deps-dev:** bump husky from 9.1.1 to 9.1.2 ([#516](https://github.com/eslint-community/eslint-plugin-promise/issues/516)) ([ab8e7a0](https://github.com/eslint-community/eslint-plugin-promise/commit/ab8e7a0d4fc8bde63fb6a6bb1e9743152778c4ee))
* file extension missing ([#519](https://github.com/eslint-community/eslint-plugin-promise/issues/519)) ([94c9834](https://github.com/eslint-community/eslint-plugin-promise/commit/94c983483596bca2baa6c710273d348f8cf98d58))
* fix format.yml ([#507](https://github.com/eslint-community/eslint-plugin-promise/issues/507)) ([948c097](https://github.com/eslint-community/eslint-plugin-promise/commit/948c09776e23e7dc38f155b268dcc002d59a957b))

## 6.0.2

- Added tests for @typescript-eslint/parser support

## 6.0.1

- Fixed @typescript-eslint/parser issue #331, #205

## 6.0.0

- Dropped node 10 from engines #231
- Updated a ton of deps #236, #237, #235, #234
- ESLint 8 support #219

## 5.2.0

- Updated `param-names` rule to allow for unused params

## 5.1.1

- Updated docs to include `no-callback-in-promise` reasons #215

## 5.1.0

- Included `catch()` and `finally()` in `prefer-await-to-then` #196
- Added some additional tests and upgraded some dev deps #196
- Exempted array methods in prefer-await-to-callbacks
  ([#212](https://github.com/eslint-community/eslint-plugin-promise/issues/212))

## 5.0.0

- ESLint 7.0 Support

## 4.3.1.

- Updated and applied prettier

## 4.3.0

- https://github.com/eslint-community/eslint-plugin-promise/pull/202
- Updated jest

## 4.2.2

- Added license
- Dependabot security updates

## 4.2.1

- Added more use cases to `no-return-wrap`

## 4.0.1

- Remove `promise/param-names` fixer
  ([#146](https://github.com/eslint-community/eslint-plugin-promise/pull/146))

## 4.0.0

- Added fixer for `promise/no-new-statics` rule
  ([#133](https://github.com/eslint-community/eslint-plugin-promise/pull/133))
- Support ESLint v5
  ([#144](https://github.com/eslint-community/eslint-plugin-promise/pull/144))

This is a breaking change that drops support for Node v4. In order to use ESLint
v5 and eslint-plugin-promise v4, you must use Node >=6.

## 3.8.0

- Removed `promise/avoid-new` from recommended configuration
  ([#119](https://github.com/eslint-community/eslint-plugin-promise/pull/119))
- Ignored event listener callbacks in `promise/prefer-await-to-callbacks`
  ([#117](https://github.com/eslint-community/eslint-plugin-promise/pull/117))
- Ignored top-level awaits in `promise/prefer-await-to-then`
  ([#126](https://github.com/eslint-community/eslint-plugin-promise/pull/126))
- Added docs for `promise/no-nesting` and `promise/prefer-await-to-then`
  ([#120](https://github.com/eslint-community/eslint-plugin-promise/pull/120))
  ([#121](https://github.com/eslint-community/eslint-plugin-promise/pull/121))

## 3.7.0

- Added `promise/valid-params` rule
  ([#85](https://github.com/eslint-community/eslint-plugin-promise/pull/85))
- Added `promise/no-new-statics` rule
  ([#82](https://github.com/eslint-community/eslint-plugin-promise/pull/82))
- Added fixer for `promise/param-names` rule
  ([#99](https://github.com/eslint-community/eslint-plugin-promise/pull/99))
- Added rule documentation to each rule
  ([#91](https://github.com/eslint-community/eslint-plugin-promise/pull/91))

## 3.6.0

- Added `['catch']` support in `catch-or-return`
- Added `no-return-in-finally` rule
- Fixed some formatting in the docs
- Added `allowReject` option to `no-return-wrap`
- Added exceptions for `no-callback-in-promise`

## 3.5.0

- Added support for recommended settings using
  `extends: plugin:promise/recommended`

## 3.4.2

- Fixed always return false positive with ternary (#31)

## 3.4.1

- fixed #49

## 3.4.0

- new rule: avoid-new
- new rule: no-promise-in-callback
- new rule: no-callback-in-promise
- new rule: no-nesting

## 3.3.2

- Removed eslint from peerDeps

## 3.3.1

- Updated engines with proper stuff
- Fixed bug for unreachable code

## 3.3.0

- Rule: `prefer-async-to-callbacks` added
- Rule: `prefer-async-to-then` added

## 3.2.1

- Fix: `no-return-wrap` rule missing from index.js

## 3.2.0

- Added `no-return-wrap` rule

## 3.1.0

- Added multiple terminationMethods

## 3.0.1

- Removed deprecated `always-catch` rule
- FIX: always-return error with "fn && fn()"

## 3.0.0

- Updated column and line numbers
- Added flow analysis for better handling of if statements

## 2.0.1

- Fixed type in docs

## 2.0.0

- ESLint 3.0 Support

## 1.3.2

- Updated tests to run on eslint 2.0
- Fixed some issues with `no-native` rule

## 1.3.1

- Actually added `no-native` rule

## 1.3.0

- Added `no-native` rule

## 1.2.0

- Allow `throw` in `always-return` rule
- Added `terminationMethod` option to `catch-or-return` rule

## 1.1.0

- Added `catch-or-return` rule

## 1.0.8

- Fixed crash issues

## 1.0.0 - 1.0.7

- Lots of basic feature updates and doc changes
