/* Socket.io code - Source: https://www.skysilk.com/blog/2018/create-real-time-chat-app-nodejs/*/
exports.ChatSocket = class ChatSocket
{
  
  constructor(family_id, server)
  {
    this.family_id = family_id;
    this.server = server;
    this.SOCKET_LIST = {};
    
    this.io = require('socket.io')(server);
    this.socketId = Math.random();
    this.io.sockets.on('connection', function(socket){
      console.log(typeof(this.SOCKET_LIST));
      console.log('new user!');
      this.SOCKET_LIST[socketId] = socket;
            
      socket.on('sendMsgToServer',function(data){
        console.log('someone sent a message!');
        for(var i in SOCKET_LIST)
        {
          this.SOCKET_LIST[i].emit('addToChat', data);
        }
      });
     
      socket.on('disconnect',function(){             
        delete this.SOCKET_LIST[socket.id];
     });
    });
  }
}



