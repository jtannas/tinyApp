/**
 * Data Model for the TinyApp
 *
 * TinyApp is a TinyURL clone made as part of the Lighthouse Labs web dev curriculum.
 * Given a long url, it will give back a short url that redirects to the long url.
 */
"use strict";

const URL_SAFE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_~';
const database = {};


/** Returns a random character from a list of URL safe characters */
const getRandomChar = function getCharFromListOfUrlSafeChars() {
  const index = Math.floor(Math.random() * URL_SAFE_CHARS.length);
  return URL_SAFE_CHARS[index];
};


const getRandomString = function getRandomStringOfUrlSafeChars(len = 6) {
  return Array.from({ length: len }, () => getRandomChar()).join('');
};


/** Generate a random key for an object using URL safe characters */
const generateKey = function generateRandomStringForPrimaryKey(obj = {}, len = 6, attemptLimit = 1000) {
  let randKey = '';

  for (let i = 0; i < attemptLimit; i++) {
    randKey = getRandomString(len);
    if (!obj.hasOwnProperty(randKey)) { return randKey; }
  }
  throw 'generateRandomStringForPrimaryKey: Too many collisions with existing keys';
};


/** Make an unlinked copy of an object */
const objCopy = function makeNewObjectWithPropertiesOfGivenObjectButIsUnlinked(obj) {
  return JSON.parse(JSON.stringify(obj));
};


const dbTableMethods = function returnASetOfMethodsForATable(tableObject, keyLen = 6) {
  return {
    get records() { return objCopy(tableObject); },
    create: function createNewRecordInDatabaseFromPropertiesObject(propertiesObject) {
      const newKey = generateKey(tableObject, keyLen);
      tableObject[newKey] = propertiesObject;
      return newKey;
    },
    get: function getRecordFromTableByKey(key) {
      const recordContents = tableObject[key];
      /* beautify preserve:start */
      return recordContents ? objCopy(recordContents) : undefined;
      /* beautify preserve:end */
    },
    delete: function deleteRecordFromTableByKey(key) {
      delete tableObject[key];
    },
    update: function updateRecordWithGivenProperties(key, properties) {
      Object.assign(tableObject[key], properties);
    }
  };
};


/** The key-value store 'database' of urls and other info */
database.urls = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    userId: "qwerty",
    dateCreated: new Date(Date.now())
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    userId: "asdfgh",
    dateCreated: new Date(Date.now())
  }
};

/** Define the urls as a database table */
exports.urls = dbTableMethods(database.urls);

database.users = {
  "qwerty": {
    email: "user@example.com",
    password: '$2a$10$cg96oq5jizqplo1RxyNgw.b.UveKHVQulo6FOEqfHFeWsQHPisTRm'
  },
  "asdfgh": {
    email: "user2@example.com",
    password: '$2a$10$ZXzlWUtn1eYToH/EHQfL0eN1UU/kMYW65x0/paR5dkTeQ28FHzT/m'
  }
};

exports.users = dbTableMethods(database.users);
