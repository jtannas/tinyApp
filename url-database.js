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

/** Generate a random key for an object using URL safe characters */
const generateKey = function generateRandomStringForPrimaryKey(obj = {}, len = 6) {
  let randKey = '';
  do {
    for (let i = 0; i < len; i++) { randKey += getRandomChar(); }
  } while (obj.hasOwnProperty(randKey));
  return randKey;
};

/** The key-value store 'database' of urls */
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/** Function to add a URL to the database */
exports.addLongUrl = function addNewUrlPairToDatabase(longUrl) {
  const newKey = generateKey(urlDatabase, 6);
  urlDatabase[newKey] = longUrl;
  return newKey;
};

/** Function to get a long url from its short url */
exports.getLongUrl = function getLongUrlMatchingShortUrl(shortUrl) {
  return urlDatabase[shortUrl];
};

/** Function to get a { <shortUrl>: <longUrl> } object */
exports.getUrlPair = function getUrlPairMatchingShortUrl(shortUrl) {
  const longUrl = urlDatabase[shortUrl];
  /* beautify preserve:start */
  return longUrl ? { [shortUrl]: longUrl } : undefined;
  /* beautify preserve:end */
};

/** Function to get all { <shortUrl>: <longUrl> } pairs */
exports.getUrlPairs = function getAllUrlPairs() {
  return urlDatabase;
};

/** Function to delete a url pair from the database */
exports.deleteUrl = function deleteUrlPairFromDatabase(shortUrl) {
  delete urlDatabase[shortUrl];
};
