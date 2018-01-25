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
const cookieParser = require('cookie-parser');

const db = require("./data-model");

/** Init App */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`TinyApp listening on port ${PORT}!`));


/** Routes */

/** Base Route */
app.get("/", (req, res) => {
  res.end("Hello!");
});

/** Login Route */
app.post("/login", (req, res) => {
  res.cookie('username', req.body['username']);
  res.redirect('back');
});

/** For listing existing short url -> long url pairs */
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: db.urls.records,
    username: req.cookies.username
  };
  res.render("urls_list", templateVars);
});

/** POST method to add a new short url -> long url pair */
app.post("/urls", (req, res) => {
  const newKey = db.urls.create(req.body.longUrl);
  res.redirect('/urls/' + newKey);
});

/** API endpoint for getting a json object of all url pairs */
app.get("/urls.json", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  };
  res.json(db.urls.records);
});

/** Displays a form for creating a new url pair */
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  };
  res.render("urls_new");
});

/** For viewing an individual short url -> long url pair */
app.get("/urls/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord) {
    const templateVars = {
      urls: {
        [req.params.shortUrl]: urlRecord
      },
      username: req.cookies.username
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send('URL not found');
  }
});

/** For updating an individual short url -> long url pair */
app.post("/urls/:shortUrl", (req, res) => {
  const urlRecord = db.urls.get(req.params.shortUrl);
  if (urlRecord) {
    db.urls.update(req.params.shortUrl, req.body);
    res.redirect("/urls");
  } else {
    res.status(404).send('URL not found');
  }
});

/** Deletes a given url pair specified by the short url */
app.post("/urls/:shortUrl/delete", (req, res) => {
  db.urls.delete(req.params.shortUrl);
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
