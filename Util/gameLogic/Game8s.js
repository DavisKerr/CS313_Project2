exports.Game8s = class Game8s
{
  constructor(famId, player1)
  {
    this.famId = famId;
    this.players = [];
    this.players.push(new Player(player1));
    this.deck = this.shuffle(this.createDeck());
    this.topCard = null;
    this.started = false;
    this.turn = 0;
    this.winner = "";
  }

  resetGame()
  {
    for(i in this.players)
    {
      this.players.deck = [];
      this.players.numCards = 0;
    }
    this.started = false;
    this.deck = this.shuffle(this.createDeck());
    this.topCard = null;
    this.turn = 0;
  }

  checkEnd()
  {
    for(var player in players)
    {
      if(players[player].deck.length == 0)
      {
        this.winner = players[player].username;
        
        return true;
      }
    }
    return false;
  }

  furtherTurn()
  {
    this.turn += 1
    if(this.turn > this.players.length - 1)
    {
      this.turn = 0;
    }
    console.log(this.turn);
  }

  deal(player)
  {
    if(this.started && this.players[this.turn].username == player)
    {
      for(var i in this.players)
      {
        if(this.players[i].username == player)
        {
          this.players[i].dealCards(this.draw(1));
          this.furtherTurn()
          return this.convertToHTML(this.players[i].deck);
        }
      }
      
    }
  }

  startGame()
  {
    if(!this.started)
    {
      for(var player in this.players)
      {
        this.players[player].dealCards(this.draw(7));
      }
      this.started = true;
      this.topCard = this.draw(1)[0];
      return this.players;
    }
    
  }

  getTop()
  {
    var color = this.topCard.charAt(0) == "R" ? "red" : this.topCard.charAt(0) == "Y" ? "yellow" : this.topCard.charAt(0) == "G" ? "green" : "blue";
    var number = this.topCard.charAt(1);
    var html = "<img src='/Images/cards/" + color + number + ".png' class='card' value='" + this.topCard + "' id='placeCard'>";
    return html;
  }

  getPlayers()
  {
    return this.players;
  }
  
  addPlayer(player)
  {
    if(this.players.length < 4)
    {
      this.players.push(new Player(player));
    }
    console.log(this.players.length);
  }

  getTurn()
  {
    return this.players[this.turn].username;
  }

  removePlayer(player)
  {
    var newPlayers = [];
    for(var i in this.players)
    {
      if(this.players[i].username != player)
      {
        newPlayers.push(this.players[i]);
      }
      else
      {
        delete this.players[i];
      }
    }
    this.players = newPlayers;
    this.turn = this.players.length - 1;
    return this.players.length;
  }

  createDeck()
  {
    var deck = [];
    for(var color = 0; color < 4; color++)
    {
      for(var number = 1; number < 13; number++)
      {
        var cVal = color == 0 ? "R" : color == 1 ? "Y" : color == 2 ? "G" : "B";
        deck.push(cVal + String(number));
        deck.push(cVal + String(number));
        deck.push(cVal + String(number));
      }
    }
    return deck;
  }

  playCard(player, card)
  {
    if(this.players[this.turn].username == player)
    {
      for(var i in this.players)
      {
        if(this.players[i].username == player)
        {
          this.players[i].removeCard(card);
          this.topCard = card;
        }
      }
      this.furtherTurn()
    }
    
  }

  playWildCard(player, card, color)
  {
    if(this.players[this.turn].username == player)
    {
      for(var i in this.players)
      {
        if(this.players[i].username == player)
        {
          this.players[i].removeCard(card);
          this.topCard = color + card.charAt(1);
        }
      }
      this.furtherTurn();
    }
    
  }
  
  /* 
   * Courtesy of https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  */
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  draw(numCards)
  {
    if(this.deck.length < numCards)
    {
      this.deck = this.shuffle(this.createDeck())
    }
    var newCards = [];
    for(var i = 0; i < numCards; i++)
    {
      newCards.push(this.deck.pop());
    }
    return newCards;
  }

  convertToHTML(cards)
  {
    var converted = [];
    cards.forEach(card => {
      var color = card.charAt(0) == "R" ? "red" : card.charAt(0) == "Y" ? "yellow" : card.charAt(0) == "G" ? "green" : "blue";
      var number = card.charAt(1);
      var html = "<img src='/Images/cards/" + color + number + ".png' class='card' value='" + card + "' onclick='playCard(this)'>";
      converted.push(html);
    });
    return converted;
  }
}

class Player
{
  constructor(username)
  {
    this.username = username;
    this.deck = [];
    this.numCards = 0;
  }

  dealCards(cards)
  {
    console.log(cards)
    for(var i = 0; i < cards.length; i++)
    {
      
      this.deck.push(cards[i]);
    }
    this.numCards = this.deck.length;
  }

  removeCard(card)
  {
    var index = this.deck.indexOf(card);
    if(index > -1)
    {
      this.deck.splice(index, 1);
    }
    this.numCards = this.deck.length;
  }
}