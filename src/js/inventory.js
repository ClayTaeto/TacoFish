//TODO: load data
const itemData = require("./gameData/items")
const startingGear = require("./gameData/equipment/startingGear")
debugger;
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


	ctrl.load = function(){
		var inv = JSON.parse(localStorage.getItem('inventory'));
		if (!inv) {
			inv = startingGear;
		}
		ctrl.inventory = inv;

		var trinkets = JSON.parse(localStorage.getItem('trinkets'));
		if (trinkets && trinkets.length) {
			ctrl.trinkets = trinkets;
		}		

		var equipment = JSON.parse(localStorage.getItem('equipment'));
		if (!equipment) {
			equipment = startingGear;
		}

		for(var i in equipment){
			ctrl.equipGear(equipment[i]);
		}		

	}

	ctrl.save = function(){
		window.localStorage.setItem('equiptment' , JSON.stringify(ctrl.equiptment));
		window.localStorage.setItem('inventory' , JSON.stringify(ctrl.inventory));
		window.localStorage.setItem('trinkets' , JSON.stringify(ctrl.trinkets));
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
		//unload trinkets
		console.log(newGear.name)
		var oldGear = ctrl.equipment[newGear.type]
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
		ctrl.equipment[newGear.category] = newGear	
		ctrl.itemHash[newGear.id] = newGear;

		ctrl.save();
	}

	//load that shit right up
	ctrl.load();
	return ctrl
}

module.exports = function(app) {
	app.factory("inventory", inv)
}