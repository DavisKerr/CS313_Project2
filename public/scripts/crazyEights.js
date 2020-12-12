/*
  Variables needed for the player:
  num cards
  isTurn

  Some way to change the color on an 8.
*/

var famId;
var username;
var socketType;
var socket;
/* 
  Socket.io Code
*/
$(document).ready(function(){
  famId = document.getElementById('famId').value;
  username = document.getElementById('username').value;
  socketType = document.getElementById('socketType').value;
  document.getElementById("topPlayerTag").innerHTML = 'Empty Seat'; 
  document.getElementById("lPlayerTag").innerHTML = 'Empty Seat';
  document.getElementById("rPlayerTag").innerHTML = 'Empty Seat';
  resetBackCards();
  
  
  socket = io();

  socket.emit('newUser', {username : username, famId : famId, socketType : socketType});  

  socket.on('dealCards', function(data){

    console.log('Drew Cards');
    var hand = document.getElementById("bottomBoard");
    var cards = "";
    data.deal.forEach(card => {
      cards = cards + '\n' + card;
    });
    
    hand.innerHTML = cards;
  });

  socket.on('topCard', function(data){
    document.getElementById("placePile").innerHTML = data.topCard;
  });

  socket.on('players', function(data){
    resetBackCards();
    console.log(data);
    slot = [document.getElementById("topPlayerTag"), document.getElementById("lPlayerTag"), document.getElementById("rPlayerTag")];
    cardSlot = [document.getElementById("topPlayerCard"), document.getElementById("lPlayerCard"), document.getElementById("rPlayerCard")];
    slotCount = 0;
    for(var i in data.players)
    {
      if(i != username)
      {
        slot[slotCount].innerHTML = i + " - " + data.players[i] + " cards";
        if(i == data.turn)
        {
          cardSlot[slotCount].src = "/Images/cards/activeBack.png";
        }
        slotCount++;
      }
    }
    if(data.turn == username)
    {
      console.log("Your turn");
      $("#bottomBoard").css("border", "1px solid #f4fc03");
    }

  });

  socket.on('gameOver', function(data){
    alert("The winner is " + data.winner);
    resetGame();
  });

  

});

function resetGame()
{
  document.getElementById("placePile").innerHTML = "<img src='/Images/cards/back.png' class='card' value='None' id='placeCard'>";
  resetBackCards();
  document.getElementById("bottomBoard").innerHTML = "";
  document.getElementById("topPlayerTag").innerHTML = 'Empty Seat'; 
  document.getElementById("lPlayerTag").innerHTML = 'Empty Seat';
  document.getElementById("rPlayerTag").innerHTML = 'Empty Seat';

}

function resetBackCards()
{
  document.getElementById("rPlayerCard").src = "/Images/cards/back.png";
  document.getElementById("lPlayerCard").src = "/Images/cards/back.png";
  document.getElementById("topPlayerCard").src = "/Images/cards/back.png";
  $("#bottomBoard").css("border", "none");
}


/* Game logic */
function playCard(myCard)
  {
    myCardVal = myCard.getAttribute("value");
    console.log(myCardVal);
    currCard = document.getElementById("placeCard").getAttribute("value");
    console.log(currCard);
    if(myCardVal.charAt(1) == '8')
    {
      var form = "<button onclick='submitWild(\"" + myCardVal + "\", \"R\")'>Red</button>";
      form += "<button onclick='submitWild(\"" + myCardVal + "\", \"B\")'>Blue</button>";
      form += "<button onclick='submitWild(\"" + myCardVal + "\", \"G\")'>Green</button>";
      form += "<button onclick='submitWild(\"" + myCardVal + "\", \"Y\")'>Yellow</button>";
      document.getElementById("wildForm").innerHTML = form;
    }
    else if(myCardVal.charAt(0) == currCard.charAt(0) || myCardVal.charAt(1) == currCard.charAt(1))
    {
      socket.emit("playCard", {card : myCardVal, username : username, famId : famId});
      document.getElementById("wildForm").innerHTML = '';
    }
    else
    {
      alert("Card not valid!");
      document.getElementById("wildForm").innerHTML = '';
    }
  }

  function drawCard()
  {
    document.getElementById("wildForm").innerHTML = '';
    socket.emit("drawOne", {username : username, famId : famId})
  }

  function startGame()
  {
    document.getElementById("startButton").remove;
    socket.emit("startGame", {famId : famId, username : username});
  }

  function submitWild(card, wild)
  {
    console.log(card);
    console.log(wild);
    document.getElementById("wildForm").innerHTML = '';
    socket.emit("playWild", {famId : famId, username : username, card : card, wild : wild})
  }
