class Block{
	constructor(game,x, y, frame){
		this.x = x;
		this.y = y;
		this.frame = frame;
		this.block = game.add.sprite(this.x, this.y, "block");
		this.block.frame = this.frame;
		game.physics.enable(this.block, Phaser.Physics.ARCADE);
		
		this.block.body.immovable = true;
		this.block.body.moves = false;

        this.block.inputEnabled = true;
        this.block.input.useHandCursor = true;
	    this.block.events.onInputDown.add(()=> {
	    	var data = {
	    		x : this.x, 
	    		y : this.y, 
	    		frame : this.frame
	    	}
	    	socket.emit("destroyBlock", data);
	    }, this);
		

		blocks.add(this.block);
	}

	destroy(){
		this.block.destroy();
	}

	update(){

	}

}
