const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const app = rewire('../data-model.js');
const appExports = require('../data-model.js');

const assert = chai.assert;

describe("users export", function() {
  return;
});
