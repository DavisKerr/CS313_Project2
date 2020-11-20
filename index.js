/* Express and node Modules */
const express = require('express')
const path = require('path')
const URL = require('url');
const bodyParser = require("body-parser");
const { body } = require('express-validator');
const { Pool } = require('pg');
const session = require('express-session');
require('dotenv').config();

/* Prove 09 Modules */
var calculateRate = require('./prove09/calculateRate');
const { checkServerIdentity } = require('tls');
const { sanitizeBody } = require('express-validator');

/* Project Modules */
var queryAccounts = require('./Data/account/queryAccount');
var createAccount = require('./Data/account/createAccount');

/* Session utilities */
var getAuth = require('./Util/Sessions/getAuth');
var logout = require('./Util/Sessions/logout');

/* Constant Variables */
const PORT = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL;
const saltRounds = 10;

const pool = new Pool({connectionString : connectionString});
if(process.env.IS_LOCAL == 'true')
{
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}


var app = express();



//app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({secret: 'shhhhhh', saveUninitialized : true, resave: true}));

app.listen(PORT);


/* Project 2*/ 

app.get("/familyGameNight/login", (req, res) => {
  if(getAuth.isLoggedIn(req))
  {
    res.redirect('/familyGameNight/home');
  }
  else
  {
    res.render('pages/auth', {login:true, page:'auth', error: (req.query.error != undefined ? req.query.error : '')});
  }
});

app.post("/familyGameNight/processLogin",[body('username').trim().escape().blacklist(';&%\\()\{\}!@#\$\^'), body('password').trim().escape().blacklist(';%&\\()\{\}!@#\$\^')] ,(req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var sess = req.session;
  queryAccounts.queryAccounts(pool, username, password, res, sess );
  
});

app.get("/familyGameNight/register", (req, res) => {
  if(getAuth.isLoggedIn(req))
  {
    res.redirect('/familyGameNight/home');
  }
  else
  {
    res.render('pages/auth', {login:false, page:'auth', error: (req.query.error != undefined ? req.query.error : '')});
  }
  
});

app.get("/familyGameNight/home", (req, res) => {
  var sess = req.session;
  if(!sess.loggedIn)
  {
    res.redirect('/familyGameNight/login');
  }
  res.end("<h1>Successful login. More content coming soon!</h1><br><a href='./logout'>Logout</a>");
});

app.post("/familyGameNight/processRegister", [
  body('fname').trim().escape().blacklist(';&%\\()\{\}!@#\$\^'), 
  body('lname').trim().escape().blacklist(';%&\\()\{\}!@#\$\^'),
  body('username').trim().escape().blacklist(';%&\\()\{\}!@#\$\^'),
  body('password').trim().escape().blacklist(';%&\\()\{\}!@#\$\^')],(req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var username = req.body.username;
    var password = req.body.password;
    createAccount.createAccount(pool, fname, lname, username, password, res, saltRounds);
});

app.get("/familyGameNight/logout", (req, res) => {
  logout.logout(req);
  res.redirect('/familyGameNight/login');
});


/* Previous proves*/
app.get("/", (req, res) => {
  res.end("<h1>Welcome!</h1><br><a href='/home.html'>Go to Postal Calendar Project</a>")
});

app.post("/calculatePostage", (req, res) => {
  var weight = Number(req.body.weight);
  var type = req.body.type;
  var zone = 0;
  if(type == 'FCP')
  {
    zone = req.body.zone;
  }

  result = calculateRate.calculateRate(weight, type, zone)
  if(result.error == true)
  {
    res.render('pages/result', result);
  }
  else
  {
    res.render('pages/result', result);
  }
});
