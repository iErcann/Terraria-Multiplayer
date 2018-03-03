
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


app.use(express.static(path.join(__dirname, 'public')));
var players = [];

function onCamera(x, y, xCam, yCam, widthCam, heightCam){
  if (x > xCam && x < xCam + widthCam && y > yCam && y < yCam + heightCam) {
      return true;
  }
  else {
    return false;
  }

}

function getPlayerById(id) {
  for (var i = 0; i < players.length; i++) {
    console.log(id, players[i].id)
    if (id === players[i].id)
      return players[i];
  }
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getOne() {
    var arr = [];
    for (var i = 0; i < arguments.length; i++) {
         arr.push(arguments[i]);
    }
  return arr[random(0, arr.length)];
}

class Player{
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
    this.xCam = undefined;
    this.yCam = undefined;
    this.widthCam = undefined;   
    this.heightCam = undefined;    

	}

}
function tree(x, y){

    var a = random(3, 6); 
    for (var i = 0 ; i < a; i++) { 
        //new Block(game, x, y-48*i, 20); 
       world.push(block = {
        x: x,
        y: y-48*i,
        frame : 20
       }) 

    }


var c = random(5, 7);
for (var j = 0 ; j < c*3; j++) {
    c--;
  size = c;
    for (var i = -(size-1); i < size; i++) {
       world.push(block = {
        x: x+i*48,
        y: y+-(a*48)-48*j,
        frame : 53
       }) 
        
        //new Block(game, x+i*48, y+-(a*48)-48*j, 53)
    }


}



}

var tree_x = 0;
var world = [];
	for (var y = 720; y <  40000; y+= 48) {
		for (var x = 0; x < 40000; x += 48) { 
			var frame_ = undefined;
			if (y === 720) { 
				frame_ = 3; 
			} else if (y > 720 && y < 1400) { 
				frame_ = getOne(1, 2);
			} else if (y > 1400) {
        if (random(0, 100) < 10) { 
				  frame_ = getOne(0, 2, 32, 33)
        }
        else {   
          frame_ = 1;
        }
			}
      if (random(0, 100) < 2) {
        tree_x += 48*15;
        tree(tree_x, 720); 
      }


			 world.push(block = {
			 	x: x,
			 	y: y,
			 	frame : frame_
			 })	

       console.log(x%48, y%48);
		}
	}


io.on('connection', function(socket){
	console.log(world.length);
 setTimeout(() => {  
  console.log(socket.id)
  players.push(new Player(500, 500, socket.id));
  var data = {
  	x : 500,
  	y : 500,
  	id : socket.id
  }
  socket.emit("id", socket.id);
  socket.emit("world", world)
  socket.broadcast.emit('player', data);

  for (var i = 0; i < players.length; i++) {
 	 if (socket.id != players[i].id) { 
	  var data_ = {
	  	x : players[i].x,
	  	y : players[i].y,
	  	id : players[i].id
	  }

	     console.log(socket.id, players[i].id)
  		 socket.emit('player', data_);
   		 //socket.broadcast.to(socket.id).emit('player', data_);

  	}
  }

setInterval(()=>  { 
  var world_temp = [];
  var player_temp = getPlayerById(socket.id)
  for (var i = 0; i < world.length; i++) {
    if (onCamera(world[i].x, world[i].y, player_temp.xCam, player_temp.yCam, player_temp.widthCam, player_temp.heightCam)) {
      world_temp.push(world[i]);
    }
  }
 
  socket.emit("world", world_temp);

}, 10);  

}, 1000);

  socket.on("playerInfo", (player)=> {
     var temp_player = getPlayerById(player.id);
     
     temp_player.xCam = player.xCam;
     temp_player.yCam = player.yCam;
     temp_player.widthCam = player.widthCam;
     temp_player.heightCam = player.heightCam;

     socket.broadcast.emit('playerInfo', player);
  })

  socket.on("destroyBlock", (block) => {
  	 for (var i = 0; i < world.length; i++) {
  	 	if (world[i].x === block.x && world[i].y === block.y) {
  	 		world.splice(i,1);
  	 	}
  	 }
     io.sockets.emit('destroyBlock', block);
  })

 
});