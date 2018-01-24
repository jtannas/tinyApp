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

  it('should exist', function() {
    assert.exists(getRandomString);
  });

  it('should be a function', function() {
    assert.isFunction(getRandomString);
  });

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
