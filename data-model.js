/**
 * Data Model for the TinyApp
 *
 * TinyApp is a TinyURL clone made as part of the Lighthouse Labs web dev curriculum.
 * Given a long url, it will give back a short url that redirects to the long url.
 */
"use strict";


const URL_SAFE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_~';

/** Returns a random character from a list of URL safe characters */
const getRandomChar = function getCharFromListOfUrlSafeChars() {
  const index = Math.floor(Math.random() * URL_SAFE_CHARS.length);
  return URL_SAFE_CHARS[index];
};

const getRandomString = function getRandomStringOfUrlSafeChars(len = 6) {
  return Array.from({ length: len }, () => getRandomChar()).join('');
};

/** Generate a random key for an object using URL safe characters */
const generateKey = function generateRandomStringForPrimaryKey(obj = {}, len = 6) {
  let randKey = '';
  do { randKey = getRandomString(len); } while (obj.hasOwnProperty(randKey));
  return randKey;
};

/** Make an unlinked copy of an object */
const objCopy = function makeNewObjectWithPropertiesOfGivenObjectButIsUnlinked(obj) {
  return JSON.parse(JSON.stringify(obj));
};


/** The key-value store 'database' of urls and other info */
const database = {
  urls: {
    "b2xVn2": {
      longUrl: "http://www.lighthouselabs.ca"
    },
    "9sm5xK": {
      longUrl: "http://www.google.com"
    }
  }
};

/** Define the urls as a database table */
exports.urls = {
  get records() { return objCopy(database.urls); },
  create: function createNewUrlRecordInDatabaseFromLongUrl(longUrl) {
    const newKey = generateKey(database.urls, 6);
    database.urls[newKey] = { 'longUrl': longUrl };
    return newKey;
  },
  get: function getUrlRecordFromUrlsTable(shortUrl) {
    const recordContents = database.urls[shortUrl];
    /* beautify preserve:start */
    return recordContents ? objCopy(recordContents) : undefined;
    /* beautify preserve:end */
  },
  delete: function deleteUrlRecordFromUrlsTable(shortUrl) {
    delete database.urls[shortUrl];
  },
  update: function updateUrlRecordWithGivenProperties(shortUrl, properties) {
    Object.assign(database.urls[shortUrl], properties);
  }
};
