const express = require("express");
const app = express();
app.set('view engine', 'ejs');


const DEFAULT_PORT = 8080;
const PORT = process.env.PORT || DEFAULT_PORT;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
