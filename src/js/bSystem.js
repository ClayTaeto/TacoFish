var bSystem = {
    fishes: { // This is a bad way of doing it, once we know different areas better we should pick from those
        types: ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"], // Spanish
        rareTypes: ["one", "two", "three", "four", "five", "six"], // English
        superRareTypes: ["oneway", "otway", "eethray", "ourfay"], // Pig Latin
        sizes: ["bits", "tiny", "small", "medium", "medium-rare", "large", "xtra-large", "venti", "decaf-beast"],
        current: {},
    },
    fish: function(location) {
        var a = Math.random(), b, c, d = 1;
        bSystem.getFish(((location) ? location : "LOCATION")); // Fills the fish arrays with fish from area that battle is in
        if(a <= 0.00012207031) { // 1/8192 chance of golden caviar appearing with the fish
            this.caviar = true;
        }else{
            this.caviar = false;
        }
        if(a <= 0.85) { // 85% chance of a common fish
            this.type = bSystem.fishes.types[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
            d *= 1.1;
        }else if(a <= 0.86) { // 1% chance of a super-rare fish
            this.type = bSystem.fishes.superRareTypes[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
            d *= 5;
        }else{ // 14% chance of a common-rare
            this.type = bSystem.fishes.rareTypes[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
            d *= 1.5;
        }
        b = Math.round(Math.random() * ((bSystem.fishes.sizes).length - 1));
        this.size = bSystem.fishes.sizes[b];
        c = Math.max((b + 1) * 150, Math.round(Math.random() * ((b + 1) * 300))) * d;
        this.hp = [c, c]; // [current HP, total HP]
    },
    start: function() {
        var a = new bSystem.fish();
        bSystem.fishes.current = a;
    },
};