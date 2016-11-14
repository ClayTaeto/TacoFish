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
    },
    fish: function(a) {
        var b = Math.random(), c, d, f = 1;
        bSystem.getFish(a); // Fills the fish arrays with fish from area that battle is in
        if(b <= 0.00012207031) { // 1/8192 chance of golden caviar appearing with the fish
            this.caviar = true;
            f *= 10;
        }else{
            this.caviar = false;
        }
        if(b <= 0.85) { // 85% chance of a common fish
            this.type = bSystem.fishes.types[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
        }else if(b <= 0.86) { // 1% chance of a super-rare fish
            this.type = bSystem.fishes.superRareTypes[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
            f *= 2.5;
        }else{ // 14% chance of a common-rare
            this.type = bSystem.fishes.rareTypes[Math.round(Math.random * ((bSystem.fishes.types).length - 1))];
            f *= 1.5;
        }
        c = Math.round(Math.random() * ((bSystem.fishes.sizes).length - 1));
        this.size = bSystem.fishes.sizes[c];
        c = Math.max((c + 1) * 150, Math.round(Math.random() * ((c + 1) * 300))) * f;
        this.hp = [d, d]; // [current HP, total HP]
    },
    start: function() {
        var a = new bSystem.fish();
        bSystem.fishes.current = a;
        alert("Caviar: " + a.caviar + ", Type: " + a.type + ", Size: " + a.size + ", HP: " + a.hp[0] + "/" + a.hp[1]);
    },
};