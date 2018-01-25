const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const app = rewire('../data-model.js');
const appExports = require('../data-model.js');

const assert = chai.assert;

describe('urls export', function() {

  it('should exist', () => assert.exists(appExports.urls));

  it('should be a object', () => assert.isObject(appExports.urls));
});


describe('urls export update function', function() {

  let revert;
  let db;
  const update = app.urls.update;
  const initialState = {
    urls: {
      test: {
        oldKey: 'oldValue'
      }
    }
  };

  beforeEach(function(done) {
    revert = app.__set__('database', JSON.parse(JSON.stringify(initialState)));
    db = app.__get__('database');
    done();
  });

  afterEach(function(done) {
    db = undefined;
    revert();
    done();
  });

  it('should exist', () => assert.exists(update));

  it('should be a function', () => assert.isFunction(update));

  it('should return nothing', () => {
    assert.isUndefined(update('test', {}));
  });

  it('should create a property if none exists', () => {
    update('test', { newKey: 'newValue' });
    assert.property(db.urls.test, 'newKey');
  });

  it('should create a property and value if none exists', () => {
    update('test', { newKey: 'newValue' });
    assert.propertyVal(db.urls.test, 'newKey', 'newValue');
  });

  it('should update a property value if it already exists', () => {
    update('test', { oldKey: 'newValue' });
    assert.propertyVal(db.urls.test, 'oldKey', 'newValue');
  });

  it('should have no effects if no properties are given', () => {
    update('test', {});
    assert.deepEqual(db, initialState);
  });
});
