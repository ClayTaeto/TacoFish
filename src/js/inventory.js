//TODO: load data
const itemData = require("./gameData/items")
const startingGear = require("./gameData/equipment/startingGear")
var inv = function(){
	var ctrl = {}
	ctrl.sayHello = function(){
		console.log("ello!")
	}

	ctrl.equipment = {
		rod: null, 
		hook: null,
		bait: null,
		pants: null,
		boat: null,
	}
	//hash table of items currently equipted. 
	ctrl.itemHash = {}

	ctrl.inventory = []
	ctrl.equipData = itemData.equipment
	
	ctrl.trinkets = []
	ctrl.trinketData = itemData.trinkets

	ctrl.statsCache = {
		attack: 0,
		depth: 0,
		luck: 0,
	}


	ctrl.load = function(){
		var inv = JSON.parse(localStorage.getItem('inventory'));
		if (!inv || !inv.length) {
			inv = startingGear;
		}
		ctrl.inventory = inv;

		var trinkets = JSON.parse(localStorage.getItem('trinkets'));
		if (trinkets && trinkets.length) {
			ctrl.trinkets = trinkets;
		}

		var equipment = JSON.parse(localStorage.getItem('equipment'));
		if (!equipment || !equipment.length) {
			equipment = startingGear;
		}

		for(var i in equipment){
			ctrl.equipGear(equipment[i]);
		}

	}

	ctrl.save = function(){		
		window.localStorage.setItem('inventory' , JSON.stringify(ctrl.inventory));
		window.localStorage.setItem('trinkets' , JSON.stringify(ctrl.trinkets));
		var equip = []
		for(var i in ctrl.equipment){
			if(ctrl.equipment[i])
				equip.push(ctrl.equipment[i])
		}
		window.localStorage.setItem('equipment' , JSON.stringify(equip));
	}

	ctrl.clean = function(){
		ctrl.inventory = []
		ctrl.trinkets = [];	
		for(var i in ctrl.equipment) {
			ctrl.equipment[i] = null
		}
		ctrl.itemHash = {}
		ctrl.save();
		//load in order to go through asssigning starting gear
		ctrl.load();		
	}

	ctrl.addItem = function(id){		
		var equip = ctrl.equipData.find(x => x.id == id);
		if(equip){
			ctrl.inventory.push(equip)
			return;
		}

		var trinket = ctrl.trinketData.find(x => x.id == id);
		if(trinket){
			ctrl.trinkets.push(item)
			return;
		}
		
		throw "Could not find item ID:" + id
	}

	//todo: swap equiptment and migrate trinkets
	ctrl.equipGear = function(newGear){
		
		if(!newGear)
			return
		//unload trinkets
		console.log(newGear.name)
		var oldGear = ctrl.equipment[newGear.category]
		if(!newGear.trinkets){
			newGear.trinkets = []
		}

		if(oldGear && oldGear.trinkets){
			//load trinkets
			for(let trinket of oldGear.trinkets){
				//replace in ctrl.equipment
				if(newGear.trinkets.length < (newGear.slots - 1)){
					newGear.trinkets.push(trinket)
					ctrl.itemHash[trinket.id] = trinket
				} else if (ctrl.itemHash[trinket.id]){
					//unallocate unused trinkets
					delete ctrl.itemHash[trinket.id]
				}
			}			
		}
		if(oldGear){
			delete ctrl.itemHash[oldGear.id];
			console.log("un-equiping " + oldGear.name)
		}
		ctrl.equipment[newGear.category] = newGear	
		ctrl.itemHash[newGear.id] = newGear;
		

		ctrl.save();
		ctrl.updateStatsCache();
	}

	ctrl.updateStatsCache = function(){
		ctrl.statsCache.attack = 0;
		ctrl.statsCache.depth = 0;
		ctrl.statsCache.luck = 0;
		//TODO: Depth
		//TODO: Attraction Bonuses
		for(var i in ctrl.itemHash){
			for(var stat in ctrl.itemHash[i].baseBonus){
				if(!ctrl.statsCache[stat]){
					ctrl.statsCache[stat] = 0
				}
				console.log("    " +ctrl.itemHash[i].name + " " + stat + " " + ctrl.itemHash[i].baseBonus[stat])
				ctrl.statsCache[stat] += ctrl.itemHash[i].baseBonus[stat]
			}
		}		
		console.log(ctrl.statsCache)
	}

	//load that shit right up
	ctrl.load();
	return ctrl
}

module.exports = function(app) {
	app.factory("inventory", inv)
}