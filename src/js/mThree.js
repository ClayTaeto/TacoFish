var mThree = {
    rows: 5, // Number of columns the match-3 has
    columns: 5, // Number of rows the match-3 has
    tileSize: 100, // Tile size in pixels
    tileSpacing: 5, // Space between tiles in pixels
    ended: true, // Will be set to true when match-3 is ended
    types: ["type1", "type2", "type3", "type4", "type5"], // All the types of tiles
    data: { // Data for all the types of tiles ["Name", "URL", (match function)]
        type1: ["Type 1", "img/type1.png", function() {}],
        type2: ["Type 2", "img/type2.png", function() {}],
        type3: ["Type 3", "img/type3.png", function() {}],
        type4: ["Type 4", "img/type4.png", function() {}],
        type5: ["Type 5", "img/type5.png", function() {}]
    },
    selected: -1, // Piece that is selected
    pieces: [], // Array to store tile objects in
    getMousePos: function(a, b) { // Function to get mouse's location on canvas
        var c = a.getBoundingClientRect();
        return {
          x: b.clientX - c.left,
          y: b.clientY - c.top
        };
    },
    checkForMatch: function(a, b) { // Function that will check if there is a match, returns true or false
       mThree.selected = -1; 
    },
    piece: function(a, b, c, d) { // Function to create piece object
        // a (required) = Column this piece is in
        // b (required) = Row this piece is in
        // c (required) = Piece ID
        // d (optional) = Spawn in a piece of a certain type
        this.id = c;
        this.spot = [a, b];
        if(d && typeof d === "string") {
            this.type = d;
        }else{
            var f = Math.round(Math.random() * ((mThree.types).length - 1));
            this.type = mThree.types[f];
        }
        this.name = mThree.data[this.type][0];
        this.img = document.createElement("img");
        (this.img).src = mThree.data[this.type][1];
    },
    create: function(a, b) { // Creates a new match-3
        // a (required) = Number of columns match-3 has
        // b (required) = Number of rows match-3 has
        mThree.rows = a;
        mThree.columns = b;
        var f, g;
        for(var d = 1; d <= b; d++) {
            for(var c = 1; c <= a; c++) {
                f = (mThree.pieces).length;
                g = new mThree.piece(c, d, f);
                (mThree.pieces).splice(f, 0, g);
            }
        }
        mThree.start();
    },
    start: function() { // Starts the match-3 (starts update loop)
        var a = document.querySelector("#mThree");
        a.width = (mThree.tileSize * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1));
        a.height = (mThree.tileSize * mThree.rows) + (mThree.tileSpacing * (mThree.rows + 1));
        a.addEventListener("click", function(e) {
            var a = mThree.getMousePos(document.querySelector("#mThree"), e);
            var b = ((a.x / (mThree.tileSize + mThree.tileSpacing)) >> 0) + 1;
            var c = ((a.y / (mThree.tileSize + mThree.tileSpacing)) >> 0) + 1;
            for(var d = 0; d < (mThree.pieces).length; d++) {
                if(mThree.pieces[d].spot[0] === b && mThree.pieces[d].spot[1] === c) {
                    if(mThree.selected !== -1) {
                        mThree.checkForMatch(d, mThree.selected);
                    }else{
                        mThree.selected = d;
                    }
                    break;
                }
            }
        });
        mThree.ended = false;
        mThree.update();
    },
    update: function() { // Updates match-3 as game is played and ends game
        // Will loop using window.requestAnimationFrame until game is run and then will call mThree.end();
        var a = document.querySelector("#mThree");
        var b = a.getContext("2d");
        if(!mThree.ended) {
            b.clearRect(0, 0, a.width, a.height);
            b.strokeRect(0, 0, a.width, a.height);
            var d, f, g;
            for(var c = 0; c < (mThree.pieces).length; c++) {
                d = mThree.pieces[c];
                f = (((d.spot[0] - 1) * mThree.tileSize) + (d.spot[0] * mThree.tileSpacing));
                g = (((d.spot[1] - 1) * mThree.tileSize) + (d.spot[1] * mThree.tileSpacing));
                b.drawImage(d.img, f, g);
                if(c === mThree.selected) {
                    b.beginPath();
                    b.moveTo(f + (mThree.tileSize / 2), g);
                    b.lineTo((f + mThree.tileSize) - mThree.tileSpacing, g);
                    b.quadraticCurveTo(f + mThree.tileSize, g, f + mThree.tileSize, g + mThree.tileSpacing);
                    b.lineTo(f + mThree.tileSize, (g + mThree.tileSize) - mThree.tileSpacing);
                    b.quadraticCurveTo(f + mThree.tileSize, g + mThree.tileSize, (f + mThree.tileSize) - mThree.tileSpacing, g + mThree.tileSize);
                    b.lineTo(f + mThree.tileSpacing, g + mThree.tileSize);
                    b.quadraticCurveTo(f, g + mThree.tileSize, f, (g + mThree.tileSize) - mThree.tileSpacing);
                    b.lineTo(f, g + mThree.tileSpacing);
                    b.quadraticCurveTo(f, g, f + mThree.tileSpacing, g);
                    b.lineTo(f + (mThree.tileSize / 2), g);
                    b.closePath();
                    b.save();
                    b.lineWidth = Math.floor(mThree.tileSpacing / 2.5);
                    b.strokeStyle = "rgba(0, 0, 0, 0.5)";
                    b.stroke();
                    b.restore();
                }
            }
            window.requestAnimationFrame(mThree.update);
        }else{
            a.clearRect(0, 0, a.width, a.height);
        }
    }
};