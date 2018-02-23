'use strict'

test('can require index file', () => {
  expect(require('../index')).toBeInstanceOf(Object)
})
