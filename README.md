# eslint-plugin-promiseparams

Enforce standard parameter names for Promise constructors

 [![travis-ci](https://travis-ci.org/jden/eslint-plugin-promiseparams.svg)](https://travis-ci.org/jden/eslint-plugin-promiseparams)
 [![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-promiseparams`:

```
$ npm install eslint-plugin-promiseparams --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-promiseparams` globally.

## Usage

Add `promiseparams` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "promiseparams"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "promiseparams/promiseparams": 2
    }
}
```

## Supported Rules

### `promiseparams`
Ensures that `new Promise()` is instantiated with the parameter names `resolve, reject` to avoid confusion with order such as `reject, resolve`. The Promise constructor uses the [RevealingConstructor pattern](https://blog.domenic.me/the-revealing-constructor-pattern/). Using the same parameter names as the language specification makes code more uniform and easier to understand.

## Etc
(c) MMXV jden <jason@denizac.org> - ISC license.




