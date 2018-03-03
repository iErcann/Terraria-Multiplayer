var socket = io();

var width =  window.innerWidth;
var height =  window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.CANVAS, "terraria", {
	preload : preload,
	create : create,
	update : update,
	render : render

});

 
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function preload(){
	game.load.spritesheet("player", "sprite/steve.png", 128, 256);
	game.load.spritesheet("block", "sprite/blocksheet.png", 48, 48);
	game.load.image("galaxy", "sprite/galaxy.jpg");
	game.load.image("slot", "sprite/slot.png");

	game.forceSingleUpdate = true;

}

var blocks;
var player;
var players = [];
function create(){
    game.stage.backgroundColor = "#000000";
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.scale.parentIsWindow = true;
	blocks = game.add.group();
    game.stage.disableVisibilityChange = true;
    //var inventory = new Inventory();
}

function update(){


for (var i = 0; i < blocks.children.length; i++){
	if (!onCamera(blocks.children[i].x, blocks.children[i].y)) {
		blocks.children[i].destroy();

	}
}


    for (var i = 0; i < players.length; i++) {
		game.physics.arcade.collide(blocks, players[i].player);
	}

	if (player != undefined) {
	  var data = {
	  	x : player.x,
	  	y : player.y,
	  	id : players[0].id,
	  	xCam : game.camera.bounds.x,
	  	yCam : game.camera.bounds.y,
	  	widthCam : game.camera.bounds.width,
	  	heightCam : game.camera.bounds.height
	  }
	  socket.emit("playerInfo", data);
		player.body.velocity.x = 0;
		move();

	game.camera.bounds.x = player.x - (game.camera.width) / 2;
	game.camera.bounds.y = player.y - (game.camera.height) / 2;
	

	}

}

function move(){
	  if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) {

      }
      if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
      	player.body.velocity.x =  -player.speed;
      }
      if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {

      }
      if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
		player.body.velocity.x =  player.speed;
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      	player.body.velocity.y = -player.flySpeed;
      }
}

function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
}

// your player
socket.on("id", (id)=> {
	var temp_player = new Player(players, game, 400, 400, id);
	players.push(temp_player);
	player = players[0].player;
 	player.body.fixedRotation = true;
	player.speed = 400; 
	player.flySpeed = 500;   

	
})


// other player
socket.on("player", (data)=> {
	var temp_player = new Player(players, game, data.x, data.y, data.id);
	players.push(temp_player);
	    for (var i = 1; i < players.length; i++) {
	    	players[i].player.body.immovable = true;
	    	players[i].player.body.moves = false;

	}
});

// get pos of other player
socket.on("playerInfo", (playerInfo)=> {
 	for (var i = 0; i < players.length; i++) {
 		if (players[i].id === playerInfo.id) {
 			players[i].player.x = playerInfo.x;
 	 	    players[i].player.y = playerInfo.y;
 		}
 	}
});

var world_ = undefined;
// get the world 
socket.on("world", (world) => {
	world_ = world;
 	renderWorld();
})

function onCamera(x, y){
	if (x > game.camera.bounds.x && x < game.camera.bounds.x + game.camera.bounds.width && y > game.camera.bounds.y && y < game.camera.bounds.y + game.camera.bounds.height) {
			return true;
	}
	else {
		return false;
	}

}

function alreadyPose(x, y){
	var x_ = x;
	var y_ = y;
	for (var i = 0; i < blocks.children.length; i++) {
		if (blocks.children[i].x === x_ && blocks.children[i].y === y_) {
			return true;
			console.log(blocks.children[i].x,x_,blocks.children[i].y,y_);
		}
	}
	return false;

}
function renderWorld(){ 
		if (world_ != undefined) { 
			for (var i = 0; i < world_.length; i++) {
				if (!alreadyPose(world_[i].x, world_[i].y) && onCamera(world_[i].x, world_[i].y)) { 
						var temp_block = new Block(game, world_[i].x, world_[i].y, world_[i].frame);
				}
			}
		}
	}
// get destroyed block 
function destroyBlock(x, y) {
	for (var i = 0; i < blocks.children.length; i++) {
		if (blocks.children[i].x === x && blocks.children[i].y === y)  {
			blocks.children[i].destroy();
		}
	}
}
socket.on("destroyBlock", (block)=>  {
	destroyBlock(block.x, block.y);
})