/**
 * Controller for the TinyApp
 *
 * TinyApp is a TinyURL clone made as part of the Lighthouse Labs web dev curriculum.
 * Given a long url, it will give back a short url that redirects to the long url.
 */
"use strict";

/** Dependencies */
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const validator = require('validator');
const bcrypt = require('bcrypt');

const db = require("./data-model");

/** Init App */
const BCRYPT_SALT_ROUNDS = 10;

const app = express();
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: process.env.session_keys || ['development'],
  maxAge: 24 * 60 * 60 * 1000
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`TinyApp listening on port ${PORT}!`));


/** Helper Functions */
const getUrlsForUser = function getAllUrlsRecordsForAGivenUserId(userId) {
  const urlRecords = db.urls.records;
  for (let key of Object.keys(urlRecords)) {
    if (urlRecords[key].userId !== userId) {
      delete urlRecords[key];
    }
  }
  return urlRecords;
};

const cleanEmail = function getTrimmedLowercaseString(str) {
  return str.trim().toLowerCase();
};

const getUserForEmail = function findTheUserObjectForAGivenEmail(email) {
  if (!email) { return undefined; }
  const cleanedEmail = cleanEmail(email);
  const userRecords = db.users.records;
  const userIds = Object.keys(userRecords);
  let loginId;
  for (let id of userIds) {
    if (userRecords[id].email === cleanedEmail) {
      return [id, userRecords[id]];
    }
  }
  return undefined;
};

const isValidLogin = function checkIfTheUserSessionIsValid(req) {
  const user = db.users.get(req.session.userId);
  return (user !== undefined);
};

/** Routes */

/** Base Route */
app.get("/", (req, res) => {
  const templateVars = {
    user: db.users.get(req.session.userId)
  };
  res.render('index', templateVars);
});

/** Login Get Route */
app.get("/login", (req, res) => {
  res.render('login');
});

/** Login Post Route */
app.post("/login", (req, res) => {
  const user = getUserForEmail(req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user[1].password)) {
    res.status(403).send('Invalid email and/or password!');
    return;
  }
  req.session.userId = user[0];
  res.redirect('/');
});

/** Logout Route */
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('back');
});

/** Register Form Get */
app.get("/register", (req, res) => {
  const templateVars = {
    user: db.users.get(req.session.userId)
  };
  res.render('register', templateVars);
});

/** Register Form Post */
app.post("/register", (req, res) => {
  let error = undefined;
  if (!validator.isEmail(req.body.email)) {
    error = 'Please provide a valid email address';
  } else if (!req.body.password || req.body.password.length < 6) {
    error = 'Please provide password 6 characters or longer';
  } else {
    const userRecords = db.users.records;
    const userIds = Object.keys(userRecords);
    const userEmails = userIds.map(id => userRecords[id].email);
    const newEmail = cleanEmail(req.body.email);
    if (userEmails.includes(newEmail)) {
      error = 'That email is already in use';
    }
  }
  if (error) {
    res.status(400).send(error);
    return;
  }

  const key = db.users.create({
    email: cleanEmail(req.body.email),
    password: bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS)
  });
  req.session.userId = key;
  res.redirect('/urls');
});

/** For listing existing short url -> long url pairs */
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: getUrlsForUser(req.session.userId),
    user: db.users.get(req.session.userId)
  };
  res.render("urls_list", templateVars);
});

/** POST method to add a new short url -> long url pair */
app.post("/urls", (req, res) => {
  if (isValidLogin(req)) {
    const newKey = db.urls.create({
      longUrl: req.body.longUrl,
      userId: req.session.userId
    });
    res.redirect('/urls/' + newKey);
  } else {
    res.redirect('/login');
  }
});

/** API endpoint for getting a json object of all url pairs */
app.get("/urls.json", (req, res) => {
  if (isValidLogin(req)) {
    const userUrls = getUrlsForUser(req.session.userId);
    res.status(200).json(userUrls);
  }
});

/** Displays a form for creating a new url pair */
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: db.users.get(req.session.userId)
  };
  if (isValidLogin(req)) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

/** For viewing an individual short url -> long url pair */
app.get("/urls/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (isValidLogin(req) && urlRecord && urlRecord.userId === req.session.userId) {
    const templateVars = {
      urls: {
        [req.params.shortUrl]: urlRecord
      },
      user: db.users.get(req.session.userId)
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send('URL not found');
  }
});

/** For updating an individual short url -> long url pair */
app.post("/urls/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (isValidLogin(req) && urlRecord && urlRecord.userId === req.session.userId) {
    db.urls.update(req.params.shortUrl, req.body);
    res.redirect("/urls");
  } else {
    res.status(404).send('URL not found');
  }
});

/** Deletes a given url pair specified by the short url */
app.post("/urls/:shortUrl/delete", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (isValidLogin(req) && urlRecord && urlRecord.userId === req.session.userId) {
    db.urls.delete(req.params.shortUrl);
  }
  res.redirect('/urls/');
});

/** Redirects directly from a short url to its matching long url */
app.get("/u/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord) {
    res.redirect((urlRecord.longUrl.startsWith('http') ? '' : '//') + urlRecord.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});
