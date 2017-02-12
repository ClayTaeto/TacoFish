var bSystem = {
    fishes: { // This is a bad way of doing it, once we know different areas better we should pick from those
        types: ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"], // Spanish
        rareTypes: ["one", "two", "three", "four", "five", "six"], // English
        superRareTypes: ["oneway", "otway", "eethray", "ourfay"], // Pig Latin
        sizes: ["bits", "tiny", "small", "medium", "medium-rare", "large", "xtra-large", "venti", "decaf-beast"],
        current: {},
    },
    getFish(a) {
        // Changes arrays in bSystem.fishes to match the fish in location (a)
        //TODO: if fish ded then get new fish
        return bSystem.fishes.current
    },
    fish: function(a) {
        var b = Math.random(), c, d, f = 1;
        
        //todo: make fish
        //bSystem.getFish(a); // Fills the fish arrays with fish from area that battle is in

        //TODO: for now, make fish random
        var fish = bSystem.fishes.current
        if(b <= 0.00012207031) { // 1/8192 chance of golden caviar appearing with the fish
            fish.caviar = true;
            f *= 10;
        }else{
            fish.caviar = false;
        }
        if(b <= 0.85) { // 85% chance of a common fish
            fish.type = bSystem.fishes.types[Math.round(Math.random() * ((bSystem.fishes.types).length - 1))];
        }else if(b <= 0.86) { // 1% chance of a super-rare fish
            fish.type = bSystem.fishes.superRareTypes[Math.round(Math.random() * ((bSystem.fishes.types).length - 1))];
            f *= 2.5;
        }else{ // 14% chance of a common-rare
            fish.type = bSystem.fishes.rareTypes[Math.round(Math.random() * ((bSystem.fishes.types).length - 1))];
            f *= 1.5;
        }
        c = Math.round(Math.random() * ((bSystem.fishes.sizes).length - 1));
        fish.size = bSystem.fishes.sizes[c];
        d = Math.max((c + 1) * 150, Math.round(Math.random() * ((c + 1) * 300))) * f;
        fish.hp = [d, d]; // [current HP, total HP]
        return fish;
    },
    start: function() {
        var a = new bSystem.fish();
        bSystem.fishes.current = a;
        //alert("Caviar: " + a.caviar + ", Type: " + a.type + ", Size: " + a.size + ", HP: " + a.hp[0] + "/" + a.hp[1]);
    },
};

export default bSystem;