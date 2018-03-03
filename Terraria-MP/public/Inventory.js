class Inventory {
	constructor(){

		for (var i = 0; i < 9; i++) { 
			for (var j = 0; j < 3; j++) { 
	    	    	var button = game.add.button(650+i*122/3,250+j*122/3, 'slot', ()=> console.log("ok"), this, 2, 1, 0);
	    	    	button.scale.setTo(0.5, 0.5);
	    	    	button.fixedToCamera = true;
			}
		}
	}
}