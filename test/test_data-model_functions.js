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

describe('dbTableMethods return object', function() {
  const dbTableMethods = app.__get__('dbTableMethods');

  it('should exist', () => {
    assert.exists(dbTableMethods);
  });

  it('should be a function', () => {
    assert.isFunction(dbTableMethods);
  });

  it('should return an object when passed an object', () => {
    assert.isObject(dbTableMethods({}));
  });

  it('should return an object with a records property', () => {
    assert.hasOwnProperty(dbTableMethods({}), 'records');
  });

  it('should return an object with a get property', () => {
    assert.hasOwnProperty(dbTableMethods({}), 'get');
  });

  it('should return an object with a delete property', () => {
    assert.hasOwnProperty(dbTableMethods({}), 'delete');
  });

  it('should return an object with an update property', () => {
    assert.hasOwnProperty(dbTableMethods({}), 'records');
  });
});

describe('dbTableMethods records getter', function() {

  const dbTableMethods = app.__get__('dbTableMethods');
  let testData;
  let testDataMethods;

  beforeEach(function(done) {
    testData = {
      key1: { oldkey: 'oldValue' },
      key2: { nested: 'prop2' }
    };
    testDataMethods = dbTableMethods(testData);
    done();
  });

  afterEach(function(done) {
    testData = undefined;
    testDataMethods = undefined;
    done();
  });

  it('should exist', () => {
    assert.exists(testDataMethods.records);
  });

  it('should be a getter', () => {
    const descriptor = Object.getOwnPropertyDescriptor(testDataMethods, 'records');
    assert.isFunction(descriptor.get);
  });

  it('should return an Object', () => {
    assert.isObject(testDataMethods.records);
  });

  it('should returns all records and nothing more', () => {
    assert.deepEqual(testData, testDataMethods.records);
  });
});

describe('dbTableMethods create function', function() {

  const dbTableMethods = app.__get__('dbTableMethods');
  const objCopy = app.__get__('objCopy');
  let testData;
  let create;
  let revert;
  let copy;

  beforeEach(function(done) {
    testData = {
      key1: { oldkey: 'oldValue' },
      key2: { nested: 'prop2' }
    };
    copy = objCopy(testData);
    create = dbTableMethods(testData).create;
    revert = app.__set__('generateKey', () => 'newKey');
    done();
  });

  afterEach(function(done) {
    testData = undefined;
    testDataMethods = undefined;
    copy = undefined;
    revert();
    done();
  });

  it('should exist', () => {
    assert.exists(create);
  });

  it('should be a function', () => {
    assert.isFunction(create);
  });

  it('should return a string key', () => {
    assert.isString(create({}));
  });

  it('should create a property', () => {
    assert.hasOwnProperty(testData, 'newKey');
  });

  it('should set the property value to the given properties', () => {
    create('successful');
    assert.propertyVal(testData, 'newKey', 'successful');
  });

  it('should not affect the rest of the object', () => {
    copy.newKey = 'successful';
    create('successful');
    assert.deepEqual(testData, copy);
  });
});

describe('dbTableMethods get function', function() {

  const dbTableMethods = app.__get__('dbTableMethods');
  let testData;
  let get;

  beforeEach(function(done) {
    testData = {
      key1: { oldkey: 'oldValue' },
      key2: { nested: 'prop2' }
    };
    get = dbTableMethods(testData).get;
    done();
  });

  afterEach(function(done) {
    testData = undefined;
    get = undefined;
    done();
  });

  it('should exist', () => {
    assert.exists(get);
  });

  it('should be a function', () => {
    assert.isFunction(get);
  });

  it('should return an Object when given a valid key', () => {
    assert.isObject(get('key1'));
  });

  it('should not directly return the object when given a valid key', () => {
    assert.notEqual(testData.key1, get('key1'));
  });

  it('should return an identical copy of the object when given a valid key', () => {
    assert.deepEqual(testData.key1, get('key1'));
  });

  it('should return undefined when given a non-existent key', () => {
    assert.isUndefined(get('invalid'));
  });
});

describe('dbTableMethods delete function', function() {

  const dbTableMethods = app.__get__('dbTableMethods');
  const objCopy = app.__get__('objCopy');
  let del;
  let testData;

  beforeEach(function(done) {
    testData = {
      key1: { oldkey: 'oldValue' },
      key2: { nested: 'prop2' }
    };
    copy = objCopy(testData);
    del = dbTableMethods(testData).delete;
    done();
  });

  afterEach(function(done) {
    testData = undefined;
    copy = undefined;
    del = undefined;
    done();
  });

  it('should exist', () => {
    assert.exists(del);
  });

  it('should be a function', () => assert.isFunction(del));

  it('should return nothing', () => {
    assert.isUndefined(del('key1'));
  });

  it('should delete a property if it exists', () => {
    del('key1');
    assert.notProperty(testData, 'key1');
  });

  it('should only delete the property that is given', () => {
    delete copy.key1;
    del('key1');
    assert.deepEqual(copy, testData);
  });

  it('should have no effects if no properties are given', () => {
    del(undefined);
    assert.deepEqual(testData, copy);
  });
});


describe('dbTableMethods update function', function() {

  const dbTableMethods = app.__get__('dbTableMethods');
  let update;
  let testData;

  beforeEach(function(done) {
    testData = {
      key1: { oldkey: 'oldValue' },
      key2: { nested: 'prop2' }
    };
    update = dbTableMethods(testData).update;
    done();
  });

  afterEach(function(done) {
    testData = undefined;
    update = undefined;
    done();
  });

  it('should exist', () => {
    assert.exists(update);
  });

  it('should be a function', () => assert.isFunction(update));

  it('should return nothing', () => {
    assert.isUndefined(update('key1', {}));
  });

  it('should create a property if none exists', () => {
    update('key1', { newKey: 'newValue' });
    assert.property(testData.key1, 'newKey');
  });

  it('should create a property and value if none exists', () => {
    update('key1', { newKey: 'newValue' });
    assert.propertyVal(testData.key1, 'newKey', 'newValue');
  });

  it('should update a property value if it already exists', () => {
    update('key1', { oldKey: 'newValue' });
    assert.propertyVal(testData.key1, 'oldKey', 'newValue');
  });

  it('should have no effects if no properties are given', () => {
    const objCopy = app.__get__('objCopy');
    const initialState = objCopy(testData);
    update('key1', {});
    assert.deepEqual(testData, initialState);
  });
});
