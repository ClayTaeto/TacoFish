var mThree = {
    rows: 5, // Number of columns the match-3 has
    columns: 5, // Number of rows the match-3 has
    types: ["type1", "type2", "type3", "type4", "type5"], // All the types of tiles
    data: { // Data for all the types of tiles ["Name", "URL"]
        type1: ["Type 1", "../img/type1.png"],
        type2: ["Type 2", "../img/type2.png"],
        type3: ["Type 3", "../img/type3.png"],
        type4: ["Type 4", "../img/type4.png"],
        type5: ["Type 5", "../img/type5.png"]
    },
    pieces: [], // Array to store tile objects in
    end: function() {}, // Will be the function that runs at the end of a match-3 game
    piece: function(a, b) { // Function to create piece object
        // a (required) = Column this piece is in
        // b (required) = Row this piece is in
        this.spot = [a, b];
        this.type = mThree.types[Math.random(0, ((mThree.types).length - 1))];
        this.name = mThree.data[this.type][0];
        this.img = mThree.data[this.type][1];
    },
    create: function(a, b, c) { // Creates a new match-3
        // a (required) = Number of columns match-3 has
        // b (required) = Number of rows match-3 has
        // c (required) = Function that runs at the end of the match-3
        mThree.rows = a;
        mThree.columns = b;
        for(var c = 1, d = 1; c <= a && d <= b; c++) {
            if(c < a) {
                mThree.pieces[(mThree.pieces).length] = new mThree.piece(c, d);
            }else if(c === a) {
                d++;
                c = 1;
                mThree.pieces[(mThree.pieces).length] = new mThree.piece(c, d);
                
            }
        }
        mThree.end = c;
        mThree.start();
    },
    start: function() { // Starts the match-3 (creates popup and starts update loop)
        // a (required) = Function to run at game end
    },
    update: function(a) { // Updates match-3 as game is played and ends game
        // Will loop using window.requestAnimationFrame until game is run and then will call mThree.end();
    }
};