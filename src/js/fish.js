var fish = function(){
	var ctrl = {};
	ctrl.caughtFish = {};
	//TODO: figure out special fish bonus??
	ctrl.registerFish = function(fish){
		//search for fish
		if(!ctrl.caughtFish[fish.type]){
			//gen new fish record 
			ctrl.caughtFish[fish.type] = {
				type: fish.type,
				count: 0,
				maxHp: 0,
				minHp: 0,
				caughtCaviar: false
			}
			//TODO: FISH SPRITES!!! FUUUUCK
		}
		var record = ctrl.caughtFish[fish.type];
		record.count += 1;
		if(record.maxHp < fish.maxHp)
			record.maxHp = fish.maxHp;

		if(record.minHp > fish.maxHp)
			record.minHp = fish.maxHp;

		if(fish.caviar)
			record.caughtCaviar = true;


		//TODO: should I do a frequency stat? 
		//TODO: region & depth caught 
		//TODO: what do I do about sizes? 
		ctrl.save();
	}
	ctrl.load = function(){
		//TODO: do some more error checkign here. 
		var fishies = JSON.parse(localStorage.getItem('caughtFish'));
		if(fishies)
			ctrl.caughtFish = fishies
	}
	ctrl.save = function(){
		window.localStorage.setItem('caughtFish' , JSON.stringify(ctrl.caughtFish));
	}

	ctrl.load();
	//TODO: should I bring fish gen over here? 
	return ctrl
}
module.exports = function(app) {
	app.factory("fish", fish)
}