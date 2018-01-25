const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const app = rewire('../data-model.js');

const assert = chai.assert;


describe('Random URL Char Generator', function() {
  const getRandomChar = app.__get__('getRandomChar ');
  const URL_SAFE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_~';

  beforeEach(function(done) {
    sinon.stub(Math, 'random').returns(0.99);
    done();
  });

  afterEach(function(done) {
    Math.random.restore();
    done();
  });

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
    for (let i = 0.00; i < 1.00; i += 0.01) {
      Math.random.restore();
      sinon.stub(Math, 'random').returns(i);
      assert.lengthOf(getRandomChar(), 1);
    }
  });

  it('should return a URL safe character', function() {
    for (let i = 0.00; i < 1.00; i += 0.01) {
      Math.random.restore();
      sinon.stub(Math, 'random').returns(i);
      assert.include(URL_SAFE_CHARS, getRandomChar());
    }
  });
});


describe('Random URL Safe String Generator', function() {
  const getRandomString = app.__get__('getRandomString');
  let revert;

  beforeEach(function(done) {
    revert = app.__set__('getRandomChar', () => 'a');
    done();
  });

  afterEach(function(done) {
    revert();
    done();
  });

  it('should exist', () => assert.exists(getRandomString));

  it('should be a function', () => assert.isFunction(getRandomString));

  it('should return a 6 character string when given no arguments', function() {
    assert.lengthOf(getRandomString(), 6);
  });

  it('should return zero characters when given a zero input', function() {
    assert.lengthOf(getRandomString(0), 0);
  });

  it('should return zero characters when given a negative input', function() {
    assert.lengthOf(getRandomString(-1), 0);
  });

  it('should return 99 characters when given a 99 input', function() {
    assert.lengthOf(getRandomString(99), 99);
  });
});

describe('objCopy for making unlinked deep copies of an object', function() {
  const objCopy = app.__get__('objCopy');

  it('should exist', () => assert.exists(objCopy));

  it('should be a function', () => assert.isFunction(objCopy));

  it('should return an object when given an object', () => {
    assert.isObject(objCopy({}));
  });

  it('should not return the same object it is given', () => {
    const testObj = {};
    assert.notEqual(objCopy(testObj), testObj);
  });

  it('should return an identical copy of an input object', () => {
    const testObj = {
      level1: 'level1',
      level2: {
        nested: 'nested'
      },
      level3: {
        nested: {
          nested: 'nested'
        }
      }
    };
    assert.deepEqual(objCopy(testObj), testObj);
  });

  it('should work on integers', () => {
    assert.strictEqual(objCopy(1), 1);
  });

  it('should work on floats', () => {
    assert.strictEqual(objCopy(0.1), 0.1);
  });

  it('should work on strings', () => {
    assert.strictEqual(objCopy('a'), 'a');
  });

  it('should copy arrays', () => {
    assert.deepEqual(objCopy([1, 2, 3]), [1, 2, 3]);
  });
});
