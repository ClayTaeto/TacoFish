//TODO: load data
//const itemData = require("./items")
//const startingGear = require("./startingGear")
var inv = [{
		id: "59379fd6-81fc-4933-b5be-db04048f9226",
		name: "Band-cute Jorts",
		type: "equip",
		category: "pants",
		description: "Some real main protagonist bullshit right here. Proficient spin attacks and heart breaking spin offs",
		slots: 2,
		baseBonus: {
			attack: 1,
		},
		attractionBonus: {				
			type: "size",
			category: "smol",
			weight: 60
		},
		img: "img/items/gear/jorts.png",
		isSpecial: false,
		specialFile: null
	}, 
	{
		id: "d37d0410-0b1b-4ba6-bca8-7c0751b62a4a",
		name: "Bamboo rod",
		type: "equip",
		category: "rod",
		description: "An old rod made from bamboo sourced from a far away valley. Inscribed with the words \"From: Wily\"",
		slots: 1,
		baseBonus: {
			depth: 10,
		},
		attractionBonus: {				
			type: "size",
			category: "smol",
			weight: 60
		},
		img: "img/items/gear/bamboorod.png",
		isSpecial: false,
		specialFile: null
	}
	, 
	{
		id: "dc4e9e44-16e2-401b-8598-be5788214bad",
		name: "PaperClip",
		type: "equipt",
		category: "hook",
		description: "Hey, It looks like you're trying to catch some fish there. Would you like help with that",
		slots: 1,
		baseBonus: {
			attack: 3,
		},
		attractionBonus: {				
			type: "size",
			category: "smol",
			weight: 60
		},
		img: "img/items/gear/paperclip.png",
		isSpecial: false,
		specialFile: null
	}
]


module.exports = inv;