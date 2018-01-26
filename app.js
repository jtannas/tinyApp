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
const SALT_ROUNDS = 10;

const app = express();
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
  for (const key in urlRecords) {
    if (urlRecords[key].userId !== userId) {
      delete urlRecords[key];
    }
  }
  return urlRecords;
};


/** Routes */

/** Base Route */
app.get("/", (req, res) => {
  res.end("Hello!");
});

/** Login Route */
app.get("/login", (req, res) => {
  res.render('login');
});
app.post("/login", (req, res) => {
  const userRecords = db.users.records;
  const userIds = Object.keys(userRecords);
  let loginId;
  userIds.some(id => {
    if (userRecords[id].email === req.body.email.trim().toLowerCase()) {
      loginId = id;
      return true;
    } else {
      return false;
    }
  });
  if (!loginId || !bcrypt.compareSync(req.body.password, userRecords[loginId].password)) {
    res.status(403).send('Invalid email and/or password!');
    return;
  }
  req.session.userId = loginId;
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
    const newEmail = req.body.email.trim().toLowerCase();
    if (userEmails.includes(newEmail)) {
      error = 'That email is already in use';
    }
  }
  if (error) {
    res.status(400).send(error);
    return;
  }

  const key = db.users.create({
    email: req.body.email.trim().toLowerCase(),
    password: bcrypt.hashSync(req.body.password, SALT_ROUNDS)
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
  if (!req.session.userId || !db.users.get(req.session.userId)) {
    res.redirect('/login');
  } else {
    const newKey = db.urls.create({
      longUrl: req.body.longUrl,
      userId: req.session.userId
    });
    res.redirect('/urls/' + newKey);
  }
});

/** API endpoint for getting a json object of all url pairs */
app.get("/urls.json", (req, res) => {
  res.json(getUrlsForUser(req.session.userId));
});

/** Displays a form for creating a new url pair */
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: db.users.get(req.session.userId)
  };
  if (!req.session.userId || !db.users.get(req.session.userId)) {
    res.redirect('/login');
  } else {
    res.render("urls_new", templateVars);
  }
});

/** For viewing an individual short url -> long url pair */
app.get("/urls/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord && urlRecord.userId === req.session.userId) {
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
  if (urlRecord && urlRecord.userId === req.session.userId) {
    db.urls.update(req.params.shortUrl, req.body);
    res.redirect("/urls");
  } else {
    res.status(404).send('URL not found');
  }
});

/** Deletes a given url pair specified by the short url */
app.post("/urls/:shortUrl/delete", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord && urlRecord.userId === req.session.userId) {
    db.urls.delete(req.params.shortUrl);
  }
  res.redirect('/urls/');
});

/** Redirects directly from a short url to its matching long url */
app.get("/u/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord) {
    res.redirect(urlRecord.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});
