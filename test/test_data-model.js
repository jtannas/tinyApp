const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const app = rewire('../data-model.js');

const assert = chai.assert;

describe('Random URL Char Generator', function() {
  const getRandomChar = app.__get__('getRandomChar');

  it('should exist', function() {
    assert.exists(getRandomChar);
  });

  it('should be a function', function() {
    assert.isFunction(getRandomChar);
  });

  it('should return a string', function() {
    for (let i = 0; i < 1000; i++) {
      assert.isString(getRandomChar());
    }
  });

  it('should return a single character', function() {
    for (let i = 0; i < 1000; i++) {
      assert.lengthOf(getRandomChar(), 1);
    }
  });
});
