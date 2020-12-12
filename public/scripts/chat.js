$(document).ready(function(){

  var chatText = document.getElementById('chat');
  var chatInput = document.getElementById('chat-input');
  var chatForm = document.getElementById('chat-form');
  var famId = document.getElementById('famId').value;
  var username = document.getElementById('username').value;
  var socketType = document.getElementById('socketType').value;
  
  
  var socket = io();
  var typing = false;

  socket.emit('newUser', {username : username, famId : famId, socketType : socketType});

  document.getElementById('chat-input').addEventListener('focus', function() {
    typing = true;
  });

  document.getElementById('chat-input').addEventListener('blur', function() {
    typing = false;
  });
  
  document.onkeyup = function(event){

    //console.log(event);
    if(!typing)
    {
      //user is not already typing, focus our chat text form
      chatInput.focus();
    }   
  }
    
  //add a chat cell to our chat list view, and scroll to the bottom
  socket.on('addToChat',function(data){
            
    console.log('got a chat message');
    chatText.innerHTML += '<div class="chatCell"><strong>' + data.username + ':</strong> ' + data.message +'</div>';
    chatText.scrollTop = chatText.scrollHeight;
            
  });
    
  
  chatForm.onsubmit = function(e){
    //prevent the form from refreshing the page
    e.preventDefault();
    //call sendMsgToServer socket function, with form text value as argument
    socket.emit('sendMsgToServer', chatInput.value);
    chatInput.value = "";
  }
});
