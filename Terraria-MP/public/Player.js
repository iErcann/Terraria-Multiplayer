class Player{
	constructor(players, game, x, y, id){
		this.player = game.add.sprite(this.x, this.y, "player");
		this.x = x;
		this.y = y;
		this.player.frame = 0;
		this.players = players;
		this.id = id;

		
		this.player.scale.setTo(0.5, 0.5);
		this.player.anchor.setTo(0.5, 0.5);
	    game.physics.enable(this.player);

		this.player.enableBody = true;
		this.player.body.gravity.y = 1000;
    	this.player.body.fixedRotation = true;
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON); 

 
		// this.players.add(this.player);

		console.log(this.x, this.y);
	}	




}
