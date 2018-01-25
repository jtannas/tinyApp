const chai = require('chai');
const appExports = require('../data-model.js');

const assert = chai.assert;

describe('urls export', function() {
  it('should exist', () => assert.exists(appExports.urls));
  it('should be an object', () => assert.isObject(appExports.urls));
});
