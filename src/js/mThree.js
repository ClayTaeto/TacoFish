var mThree = {
    rows: 5,
    columns: 5,
    tileSize: 100,
    tileSpacing: 5,
    ended: true,
    types: ["type1", "type2", "type3", "type4", "type5"],
    data: { // Data for all the types of tiles ["Name", "URL", (match function)]
        type1: ["Type 1", "img/type1.png", function() {
            alert(mThree.data.type1[0] + "!");
        }],
        type2: ["Type 2", "img/type2.png", function() {
            alert(mThree.data.type2[0] + "!");
        }],
        type3: ["Type 3", "img/type3.png", function() {
            alert(mThree.data.type3[0] + "!");
        }],
        type4: ["Type 4", "img/type4.png", function() {
            alert(mThree.data.type4[0] + "!");
        }],
        type5: ["Type 5", "img/type5.png", function() {
            alert(mThree.data.type5[0] + "!");
        }]
    },
    selected: -1,
    pieces: [],
    getMousePos: function(a, b) { // Function to get mouse's location on canvas
        // a (required) = Canvas to get mouse position on
        // b (required) = The click event itself
        var c = a.getBoundingClientRect();
        return {
          x: b.clientX - c.left,
          y: b.clientY - c.top
        };
    },
    checkForMatch: function(a) { // Function that will check if there is a match, returns true or false
        // a (required) = Array of location of tile to check for matches with mThree.selected
        var b = mThree.pieces[a[0]][a[1]];
        var c = mThree.selected;
        if(a[1] >= 4 && mThree.pieces[a[0]][a[1] - 4].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 3].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "5v, 4 up";
        }else if(a[1] >= 3 && a[1] <= mThree.rows - 1 && mThree.pieces[a[0]][a[1] - 3].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "5v, 3 up 1 down";
        }else if(a[1] >= 2 && a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type) {
            return "5v, 2 up 2 down";
        }else if(a[1] >= 1 && a[1] <= mThree.rows - 3 && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 3].type === mThree.pieces[c[0]][c[1]].type) {
            return "5v, 1 up 3 down";
        }else if(a[1] <= mThree.rows - 4 && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 3].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 4].type === mThree.pieces[c[0]][c[1]].type) {
            return "5v, 4 down";
        }else if(a[0] >= 4 && mThree.pieces[a[0] - 4][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 3][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "5h, 4 left";
        }else if(a[0] >= 3 && a[0] <= mThree.columns - 1 && mThree.pieces[a[0] - 3][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "5h, 3 left 1 right";
        }else if(a[0] >= 2 && a[0] <= mThree.columns - 2 && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 2][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "5h, 2 left 2 right";
        }else if(a[0] >= 1 && a[0] <= mThree.columns - 3 && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 3][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "5h, 1 left 3 right";
        }else if(a[0] <= mThree.columns - 4 && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 3].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 4].type === mThree.pieces[c[0]][c[1]].type) {
            return "5h, 4 right";
        }else if(a[1] >= 3 && mThree.pieces[a[0]][a[1] - 3].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "4v, 3 up";
        }else if(a[1] >= 2 && a[1] <= mThree.rows - 1 && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "4v, 2 up 1 down";
        }else if(a[1] >= 1 && a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type) {
            return "4v, 1 up 2 down";
        }else if(a[1] <= mThree.rows - 3 && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 3].type === mThree.pieces[c[0]][c[1]].type) {
            return "4v, 3 down";
        }else if(a[0] >= 3 && mThree.pieces[a[0] - 3][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "4h, 3 left";
        }else if(a[0] >= 2 && a[0] <= mThree.columns - 1 && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "4h, 2 left 1 right";
        }else if(a[0] >= 1 && a[0] <= mThree.columns - 2 && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 2][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "4h, 1 left 2 right";
        }else if(a[0] <= mThree.columns - 3 && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 3][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "4h, 3 right";
        }else if(a[1] >= 2 && mThree.pieces[a[0]][a[1] - 2].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "3v, 2 up";
        }else if(a[1] >= 1 && a[1] <= mThree.rows - 1 && mThree.pieces[a[0]][a[1] - 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type) {
            return "3v, 1 up 1 down";
        }else if(a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] + 1].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0]][a[1] + 2].type === mThree.pieces[c[0]][c[1]].type) {
            return "3v, 2 down";
        }else if(a[0] >= 2 && mThree.pieces[a[0] - 2][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "3h, 2 left";
        }else if(a[0] >= 1 && a[0] <= mThree.columns - 1 && mThree.pieces[a[0] - 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "3h, 1 left 1 right";
        }else if(a[0] <= mThree.columns - 2 && mThree.pieces[a[0] + 1][a[1]].type === mThree.pieces[c[0]][c[1]].type && mThree.pieces[a[0] + 2][a[1]].type === mThree.pieces[c[0]][c[1]].type) {
            return "3h, 2 right";
        }
        return false;
    },
    makeMatch(a, b, c) { // Function that will switch tile a and tile b, and will handle the resulting match
        // a (required) = Array of location of tile a
        // b (required) = Array of location of tile b
        // c (optional, but recommended) = Type of match that will be made
        mThree.data[mThree.pieces[a[0]][a[1]].type][3]();
        mThree.selected = -1;
    },
    piece: function(a) { // Function to create piece object
        // a (optional) = Spawn in a piece of a certain type
        if(a && typeof a === "string") {
            this.type = a;
        }else{
            var d = Math.round(Math.random() * ((mThree.types).length - 1));
            this.type = mThree.types[d];
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
        for(var d = 0; d <= (b - 1); d++) {
            mThree.pieces[d] = [];
            for(var c = 0; c <= (a - 1); c++) {
                (mThree.pieces[d]).splice(c, 0, new mThree.piece());
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
            var b = ((a.x / (mThree.tileSize + mThree.tileSpacing)) >> 0);
            var c = ((a.y / (mThree.tileSize + mThree.tileSpacing)) >> 0);
            if(mThree.selected !== -1 && !(mThree.selected[0] === b && mThree.selected[1] === c) && mThree.checkForMatch([b, c])) {
                mThree.makeMatch([b, c], mThree.selected, mThree.checkForMatch([b, c]));
            }else{
                mThree.selected = [b, c];
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
            var f, g, h;
            for(var c = 0; c < (mThree.pieces).length; c++) {
                for(var d = 0; d < (mThree.pieces[c]).length; d++) {
                    f = mThree.pieces[c];
                    g = ((c * mThree.tileSize) + ((c + 1) * mThree.tileSpacing));
                    h = ((d * mThree.tileSize) + ((d + 1) * mThree.tileSpacing));
                    b.drawImage(mThree.pieces[c][d].img, g, h);
                    if(Array.isArray(mThree.selected) && mThree.selected[0] === c && mThree.selected[1] === d) {
                        b.beginPath();
                        b.moveTo(g + (mThree.tileSize / 2), h);
                        b.lineTo((g + mThree.tileSize) - mThree.tileSpacing, h);
                        b.quadraticCurveTo(g + mThree.tileSize, h, g + mThree.tileSize, h + mThree.tileSpacing);
                        b.lineTo(g + mThree.tileSize, (h + mThree.tileSize) - mThree.tileSpacing);
                        b.quadraticCurveTo(g + mThree.tileSize, h + mThree.tileSize, (g + mThree.tileSize) - mThree.tileSpacing, h + mThree.tileSize);
                        b.lineTo(g + mThree.tileSpacing, h + mThree.tileSize);
                        b.quadraticCurveTo(g, h + mThree.tileSize, g, (h + mThree.tileSize) - mThree.tileSpacing);
                        b.lineTo(g, h + mThree.tileSpacing);
                        b.quadraticCurveTo(g, h, g + mThree.tileSpacing, h);
                        b.lineTo(g + (mThree.tileSize / 2), h);
                        b.closePath();
                        b.save();
                        b.lineWidth = Math.floor(mThree.tileSpacing / 2.5);
                        b.strokeStyle = "rgba(0, 0, 0, 0.5)";
                        b.stroke();
                        b.restore();
                    }
                }
            }
            /*for(var c = 0; c < (mThree.pieces).length; c++) {
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
            }*/
            window.requestAnimationFrame(mThree.update);
        }else{
            a.clearRect(0, 0, a.width, a.height);
        }
    }
};