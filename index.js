/* Express and node Modules */
const express = require('express');
const path = require('path')
const URL = require('url');
const bodyParser = require("body-parser");
const { body } = require('express-validator');
const { Pool } = require('pg');
const session = require('express-session');
var router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();


/* Prove 09 Modules */
var calculateRate = require('./prove09/calculateRate');
const { checkServerIdentity } = require('tls');
const { sanitizeBody } = require('express-validator');

/* Project Modules */
var queryAccounts = require('./Data/account/queryAccount');
var createAccount = require('./Data/account/createAccount');
var createFamily = require('./Data/family/createFamily');
var joinFamily = require('./Data/family/joinFamily');
var queryIsInFamily = require('./Data/family/queryIsInFamily');
var queryFamily = require('./Data/family/queryFamily');
var Game8s = require("./Util/gameLogic/Game8s");

/* Session utilities */
var getAuth = require('./Util/Sessions/getAuth');
var logout = require('./Util/Sessions/logout');
const { emit } = require('process');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');

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
var server = require('http').createServer(app);

//app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({secret: 'shhhhhh', saveUninitialized : true, resave: true}));



SOCKET_LIST = {};
var users = {};
var games_for_8s = {};
var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){

  socket.on('newUser', function(data){
    var socketId = data.username;
    socket.username = data.username;
    socket.famId = data.famId;
    socket.type = data.socketType;
    if(socket.type == "Chat")
    {
      console.log(socket.username + " joined the chat.")
      
    }
    else
    {
      console.log(socket.username + " joined the game.");
      if(games_for_8s[data.famId])
      {
        console.log("Exists");
        games_for_8s[data.famId].addPlayer(data.username);
        socket.game = games_for_8s[data.famId];
      }
      else
      {
        console.log("Doesn't");
        games_for_8s[data.famId] = new Game8s.Game8s(data.famId, data.username);
        socket.game = games_for_8s[data.famId];
      }
      
    }
    users[socket.username] = socket;
    console.log(users[socket.username].type);
  });

  socket.on("startGame", function(data){
    console.log("Started");
    for(var i in users)
    {
      if(users[i].type = "CrazyEights")
      {
        var players = games_for_8s[users[i].famId].startGame();
        for(var player in players)
        {
          users[players[player].username].emit("dealCards", {deal : games_for_8s[users[i].famId].convertToHTML(players[player].deck)});
          users[players[player].username].emit("topCard", {topCard : games_for_8s[users[i].famId].getTop()});
        }
        break;
      }
    }
    emitLengths(users[data.username].game.getPlayers(), users[data.username].famId, users[data.username].game.getTurn());
  });

  socket.on("drawOne", function(data){
    users[data.username].emit('dealCards', {deal : users[socket.username].game.deal(data.username)});
    emitLengths(users[data.username].game.getPlayers(), users[data.username].famId, users[data.username].game.getTurn());
  });

  socket.on("playCard", function(data){
    games_for_8s[data.famId].playCard(data.username, data.card);
    players = games_for_8s[data.famId].getPlayers();
    for(var player in players)
    {
      users[players[player].username].emit("dealCards", {deal : games_for_8s[data.famId].convertToHTML(players[player].deck)});
      users[players[player].username].emit("topCard", {topCard : games_for_8s[data.famId].getTop()});
      if(games_for_8s[data.famId].checkEnd())
      {
        users[players[player].username].emit("gameOver", {winner : games_for_8s[data.famId].winner});
      }
    }
    emitLengths(users[data.username].game.getPlayers(), users[data.username].famId, users[data.username].game.getTurn());
  });

  socket.on("playWild", function(data){
    console.log(data.wild);
    games_for_8s[data.famId].playWildCard(data.username, data.card, data.wild);
    players = games_for_8s[data.famId].getPlayers();
    for(var player in players)
    {
      users[players[player].username].emit("dealCards", {deal : games_for_8s[data.famId].convertToHTML(players[player].deck)});
      users[players[player].username].emit("topCard", {topCard : games_for_8s[data.famId].getTop()});
      if(games_for_8s[data.famId].checkEnd())
      {
        users[players[player].username].emit("gameOver", {winner : games_for_8s[data.famId].winner});
      }
    }
    emitLengths(users[data.username].game.getPlayers(), users[data.username].famId, users[data.username].game.getTurn());
    
  });
       
  socket.on('sendMsgToServer',function(data){

    console.log('someone sent a message!');
    for(var i in users)
    {
      
      if(users[i].famId == socket.famId)
      {
        users[i].emit('addToChat', {username: socket.username, message: data});
      }
    }
    
  });

  socket.on('disconnect',function(){
    console.log(socket.username + " Disconnected.");
    if(socket.username && users[socket.username].type == "CrazyEights")
    {
      console.log("removing " + socket.username)
      if(users[socket.username].game.removePlayer(socket.username) == 0)
      {
        newGames = {};
        for(var game in games_for_8s)
        {
          if(game.famId != users[socket.username].famId)
          {
            newGames[game.famId] = game;
          }
        }
        games_for_8s = newGames;
        if(games_for_8s[users[socket.username]])
        {
          console.log("Delete failed.");
        } 
      }
    }
    delete users[socket.username];
 });
 
});


function emitLengths(players, famId, turn)
{
  playerList = {}
  for(var i in players)
  {
    playerList[players[i].username] = players[i].numCards;
  }

  for(var j in users)
  {
    if(users[j].game && users[j].game.famId == famId)
    {
      users[j].emit("players", {players : playerList, turn : turn});
    }
  }

  return playerList;
}

server.listen(PORT); // Used to be app.


/* Socket.io code - Source: https://www.skysilk.com/blog/2018/create-real-time-chat-app-nodejs/*/





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
  queryAccounts.queryAccounts(pool, username, password, res, sess);
  
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
  else
  {
    
    if(sess.isPartFam)
    {
      res.render('pages/home', {login: false, page:'home', isPartFam: true})
    }
    else
    {
      queryIsInFamily.queryIsInFamily(pool, res, sess);
    }
  }
  
});

app.get("/familyGameNight/chat", (req, res) => {
  var sess = req.session;
  if(!sess.loggedIn)
  {
    res.redirect('/familyGameNight/login');
  }
  else
  {
    var idStr = sess.famId;
    res.render('pages/chat', {login: false, page:'chat', famIdStr : idStr, 
    username : (sess.fname + ' ' + sess.lname.charAt(0)), socketType : "Chat"});
  }
  
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

app.post('/familyGameNight/processCreateFam', [
  body('famName').trim().blacklist(';&%\\()\{\}!@#\$\^').escape(), 
  body('famCode').trim().blacklist(';%&\\()\{\}!@#\$\^').escape()], (req, res) => {
    var famName = req.body.famName;
    var famCode = req.body.famCode;
    var sess = req.session;
    createFamily.createFamily(pool, famName, famCode, res, sess, joinFamily);
});

app.post('/familyGameNight/processJoinFam', [
  body('famName').trim().blacklist(';&%\\()\{\}!@#\$\^').escape(), 
  body('famCode').trim().blacklist(';%&\\()\{\}!@#\$\^').escape()], (req, res) => {
    var famName = req.body.famName;
    var famCode = req.body.famCode;
    var sess = req.session;
    joinFamily.joinFamily(pool, famName, famCode, res, sess);
});

app.post('/familyGameNight/processJoinFam', [
  body('famName').trim().blacklist(';&%\\()\{\}!@#\$\^').escape(), 
  body('famCode').trim().blacklist(';%&\\()\{\}!@#\$\^').escape()], (req, res) => {
    var famName = req.body.famName;
    var famCode = req.body.famCode;
    var sess = req.session;
    joinFamily.joinFamily(pool, famName, famCode, res, sess);
});

app.get('/familyGameNight/family', (req, res) =>
{
  var sess = req.session;
  if(!sess.loggedIn)
  {
    res.redirect('/familyGameNight/login');
  }
  else
  {
    queryFamily.queryFamily(pool, sess, res);
  }
  
});

app.get('/familyGameNight/crazyEights', (req, res) =>
{
  var sess = req.session;
  if(!sess.loggedIn)
  {
    res.redirect('/familyGameNight/login');
  }
  else
  {
    res.render('pages/crazyEights', {login: false, page:'game', famIdStr : sess.famId, 
    username : (sess.fname + ' ' + sess.lname.charAt(0)), socketType : "CrazyEights"});
  }
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

/* Week 12 Team Activity */
/*
var logRequest = function (req, res, next) {
  console.log("Received a request for: " + req.url);
  next();
}

var verifyLogin = function(req, res, next){
  var sess = req.session;
  if(sess.username)
  {
    next();
  }
  else
  {
    res.status(401);
    res.json({success : false});
  }
}

app.use(logRequest);


app.post('/TA12/logout', (req, res) => {
  var sess = req.session;
  if(sess.username)
  {
    sess.destroy();
    res.json({success : true});
  }
  else
  {
    res.json({success : false});
  }
});

app.post('/TA12/login', [
  body('username').trim().blacklist(';&%\\()\{\}!@#\$\^').escape(), 
  body('password').trim().blacklist(';%&\\()\{\}!@#\$\^').escape()], (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var sess = req.session;

    pool.query('SELECT * FROM accounts WHERE username = $1', [username], (req, result) => {
      if(result.rows[0])
      {
        bcrypt.compare(password, result.rows[0].password.trim(), (err, match) => {
          if(match)
          {
            sess.username = username;
            res.json({success: true});
          }
          else
          {
            res.json({success : false});
          }
        });
      }
    }); 
});

app.get('/TA12/getServerTime', verifyLogin, (req, res) => {
  var time = new Date()
  res.json({success : true, time : time}); 
});

app.get('/TA12', (req, res) => {
  res.render('pages/test');
});*/


