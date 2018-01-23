"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


const DEFAULT_PORT = 8080;
const PORT = process.env.PORT || DEFAULT_PORT;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/** Generate a random key for an object using URL safe characters */
const generateKey = function generateRandomStringForPrimaryKey(obj = {}, len = 6) {

  const getRandUrlSafeChar = function() {
    const safeChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_~';
    const index = Math.floor(Math.random() * safeChars.length);
    return safeChars[index];
  };

  let randKey = '';
  do {
    for (let i = 0; i < len; i++) { randKey += getRandUrlSafeChar(); }
  } while (obj.hasOwnProperty(randKey));
  return randKey;
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { host: req.headers.host };
  templateVars.urls = {};
  templateVars.urls[req.params.id] = urlDatabase[req.params.id];
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    host: req.headers.host
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
