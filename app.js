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

const urlDatabase = require("./url-database");

/** Init App */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`TinyApp listening on port ${PORT}!`));


/** Routes */

/** Base Route */
app.get("/", (req, res) => {
  res.end("Hello!");
});

/** For listing existing short url -> long url pairs */
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase.getUrlPairs(),
    host: req.headers.host
  };
  res.render("urls_show", templateVars);
});

/** POST mehthod to add a new short url -> long url pair */
app.post("/urls", (req, res) => {
  const newKey = urlDatabase.addLongUrl(req.body.longUrl);
  res.redirect('/urls/' + newKey);
});

/** API endpoint for getting a json object of all url pairs */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase.getUrlPairs());
});

/** Displays a form for creating a new url pair */
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/** For viewing an individual short url -> long url pair */
app.get("/urls/:shortUrl", (req, res) => {
  const urlPair = urlDatabase.getUrlPair(req.params.shortUrl);
  if (urlPair) {
    const templateVars = {
      urls: urlPair,
      host: req.headers.host
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send('URL not found');
  }
});

/** Deletes a given url pair specified by the short url */
app.post("/urls/:shortUrl/delete", (req, res) => {
  urlDatabase.deleteUrl(req.params.shortUrl);
  res.redirect('/urls/');
});

/** Redirects directly from a short url to its matching long url */
app.get("/u/:shortUrl", (req, res) => {
  const longUrl = urlDatabase.getLongUrl(req.params.shortUrl);
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});
