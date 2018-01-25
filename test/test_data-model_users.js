const chai = require('chai');
const appExports = require('../data-model.js');

const assert = chai.assert;

describe('users export', function() {
  it('should exist', () => assert.exists(appExports.users));
  it('should be an object', () => assert.isObject(appExports.users));
});
