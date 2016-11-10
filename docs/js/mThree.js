var mThree = {
    selector: document.querySelector("#mThree"),
    rows: 5,
    columns: 5,
    tileSize: 100,
    tileSpacing: 5,
    ended: true,
    pieces: [],
    types: ["type1", "type2", "type3", "type4", "type5"],
    data: { // Data for all the types of tiles ["Name", "URL", (match function)]
        type1: ["Type 1", "img/type1.png", function() {
            alert(mThree.data.type1[0] + " matched!");
        }],
        type2: ["Type 2", "img/type2.png", function() {
            alert(mThree.data.type2[0] + " matched!");
        }],
        type3: ["Type 3", "img/type3.png", function() {
            alert(mThree.data.type3[0] + " matched!");
        }],
        type4: ["Type 4", "img/type4.png", function() {
            alert(mThree.data.type4[0] + " matched!");
        }],
        type5: ["Type 5", "img/type5.png", function() {
            alert(mThree.data.type5[0] + " matched!");
        }]
    },
    effects: [],
    selected: -1,
    canSelect: true,
    selectedStyle: "rgb(0, 0, 0, 0.5d)",
    lastUpdateTime: 0,
    getMousePos: function(a, b) { // Function to get mouse's location on canvas
        // a (required) = Canvas to get mouse position on
        // b (required) = The click event itself
        var c = a.getBoundingClientRect();
        return {
          x: b.clientX - c.left,
          y: b.clientY - c.top
        };
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
    effect: function(a, b, c, d) {
        this.type = a;
        this.data = b;
        this.time = [0, c];
        this.onComplete = d;
    },
    checkForNeighbor: function(a, b) {
        if(a[0] + 1 === b[0] && a[1] === b[1]) {
            return "right";
        }else if(a[0] - 1 === b[0] && a[1] === b[1]) {
            return "left";
        }else if(a[0] === b[0] && a[1] + 1 === b[1]) {
            return "down";
        }else if(a[0] === b[0] && a[1] - 1 === b[1]) {
            return "up";
        }else{
            return false;
        }
    },
    checkForMatch: function(a, b, c) { // Function that will check if there is a match, returns a string or false
        // a (required) = Piece #1 location
        // b (required) = Piece #2 location
        // c (required) = Type of match to check for
        var g = [];
        if(a[1] >= 4 && mThree.pieces[a[0]][a[1] - 4].type === c && mThree.pieces[a[0]][a[1] - 3].type === c && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c) {
            g.splice(g.length, 0, "5v, 4 up");
        }
        if(a[1] >= 3 && a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] - 3].type === c && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c) {
            g.splice(g.length, 0, "5v, 3 up 1 down");
        }
        if(a[1] >= 2 && a[1] <= mThree.rows - 3 && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c) {
            g.splice(g.length, 0, "5v, 2 up 2 down");
        }
        if(a[1] >= 1 && a[1] <= mThree.rows - 4 && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c && mThree.pieces[a[0]][a[1] + 3].type === c) {
            g.splice(g.length, 0, "5v, 1 up 3 down");
        }
        if(a[1] <= mThree.rows - 5 && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c && mThree.pieces[a[0]][a[1] + 3].type === c && mThree.pieces[a[0]][a[1] + 4].type === c) {
            g.splice(g.length, 0, "5v, 4 down");
        }
        if(a[0] >= 4 && mThree.pieces[a[0] - 4][a[1]].type === c && mThree.pieces[a[0] - 3][a[1]].type === c && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c) {
            g.splice(g.length, 0, "5h, 4 left");
        }
        if(a[0] >= 3 && a[0] <= mThree.columns - 2 && mThree.pieces[a[0] - 3][a[1]].type === c && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c) {
            g.splice(g.length, 0, "5h, 3 left 1 right");
        }
        if(a[0] >= 2 && a[0] <= mThree.columns - 3 && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c && mThree.pieces[a[0] + 2][a[1]].type === c) {
            g.splice(g.length, 0, "5h, 2 left 2 right");
        }
        if(a[0] >= 1 && a[0] <= mThree.columns - 4 && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c && mThree.pieces[a[0] + 2][a[1]].type === c && mThree.pieces[a[0] + 3][a[1]].type === c) {
            g.splice(g.length, 0, "5h, 1 left 3 right");
        }
        if(a[0] <= mThree.columns - 5 && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c && mThree.pieces[a[0]][a[1] + 3].type === c && mThree.pieces[a[0]][a[1] + 4].type === c) {
            g.splice(g.length, 0, "5h, 4 right");
        }
        if(a[1] >= 3 && mThree.pieces[a[0]][a[1] - 3].type === c && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c) {
            g.splice(g.length, 0, "4v, 3 up");
        }
        if(a[1] >= 2 && a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c) {
            g.splice(g.length, 0, "4v, 2 up 1 down");
        }
        if(a[1] >= 1 && a[1] <= mThree.rows - 3 && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c) {
            g.splice(g.length, 0, "4v, 1 up 2 down");
        }
        if(a[1] <= mThree.rows - 4 && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c && mThree.pieces[a[0]][a[1] + 3].type === c) {
            g.splice(g.length, 0, "4v, 3 down");
        }
        if(a[0] >= 3 && mThree.pieces[a[0] - 3][a[1]].type === c && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c) {
            g.splice(g.length, 0, "4h, 3 left");
        }
        if(a[0] >= 2 && a[0] <= mThree.columns - 2 && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c) {
            g.splice(g.length, 0, "4h, 2 left 1 right");
        }
        if(a[0] >= 1 && a[0] <= mThree.columns - 3 && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c && mThree.pieces[a[0] + 2][a[1]].type === c) {
            g.splice(g.length, 0, "4h, 1 left 2 right");
        }
        if(a[0] <= mThree.columns - 4 && mThree.pieces[a[0] + 1][a[1]].type === c && mThree.pieces[a[0] + 2][a[1]].type === c && mThree.pieces[a[0] + 3][a[1]].type === c) {
            g.splice(g.length, 0, "4h, 3 right");
        }
        if(a[1] >= 2 && mThree.pieces[a[0]][a[1] - 2].type === c && mThree.pieces[a[0]][a[1] - 1].type === c) {
            g.splice(g.length, 0, "3v, 2 up");
        }
        if(a[1] >= 1 && a[1] <= mThree.rows - 2 && mThree.pieces[a[0]][a[1] - 1].type === c && mThree.pieces[a[0]][a[1] + 1].type === c) {
            g.splice(g.length, 0, "3v, 1 up 1 down");
        }
        if(a[1] <= mThree.rows - 3 && mThree.pieces[a[0]][a[1] + 1].type === c && mThree.pieces[a[0]][a[1] + 2].type === c) {
            g.splice(g.length, 0, "3v, 2 down");
        }
        if(a[0] >= 2 && mThree.pieces[a[0] - 2][a[1]].type === c && mThree.pieces[a[0] - 1][a[1]].type === c) {
            g.splice(g.length, 0, "3h, 2 left");
        }
        if(a[0] >= 1 && a[0] <= mThree.columns - 2 && mThree.pieces[a[0] - 1][a[1]].type === c && mThree.pieces[a[0] + 1][a[1]].type === c) {
            g.splice(g.length, 0, "3h, 1 left 1 right");
        }
        if(a[0] <= mThree.columns - 3 && mThree.pieces[a[0] + 1][a[1]].type === c && mThree.pieces[a[0] + 2][a[1]].type === c) {
            g.splice(g.length, 0, "3h, 2 right");
        }
        return ((g.length > 0) ? g : false);
    },
    makeMatch(a, b, c) { // Function that will switch tile a and tile b, and will handle the resulting match
        // a (required) = Array of location of tile a
        // b (required) = Array of location of tile b
        // c (optional, but recommended) = Type of match that will be made
        mThree.data[mThree.pieces[b[0]][b[1]].type][2]();
        mThree.selected = -1;
    },
    click: function(e) {
        if(mThree.canSelect) {
            e = e || window.event;
            var a = mThree.getMousePos(mThree.selector, e);
            var b = ((a.x / (mThree.tileSize + mThree.tileSpacing)) >> 0);
            var c = ((a.y / (mThree.tileSize + mThree.tileSpacing)) >> 0);
            var d = mThree.checkForNeighbor([b, c], mThree.selected);
            var f = mThree.checkForNeighbor(mThree.selected, [b, c]);
            if(mThree.selected[0] === b && mThree.selected[1] === c) {
                mThree.selected = -1;
            }else if(mThree.selected !== -1 && d !== false) {
                mThree.canSelect = false;
                var i = new mThree.effect("switch", [[b, c], mThree.selected, d], 500, function() {
                    for(var a = 0; a < (mThree.effects).length; a++) {
                        if(mThree.effects[a].type === "switch") {
                            break;
                        }
                    }
                    var b = mThree.effects[a];
                    var c = mThree.checkForNeighbor(b.data[0], b.data[1]);
                    var d = mThree.checkForNeighbor(b.data[1], b.data[0]);
                    var f = mThree.checkForMatch(b.data[0], b.data[1], mThree.pieces[b.data[1][0]][b.data[1][1]].type, c);
                    var g = mThree.checkForMatch(b.data[1], b.data[0], mThree.pieces[b.data[0][0]][b.data[0][1]].type, d);
                    if(f !== false || g !== false) {
                        if(f !== false) {
                            for(var h = 0; h < f.length; h++) {
                                mThree.makeMatch(b.data[0], b.data[1], f[h]);
                            }
                        }
                        if(g !== false) {
                            for(var i = 0; i < g.length; i++) {
                                mThree.makeMatch(b.data[1], b.data[0], g[i]);
                            }
                        }
                    }else{
                        var j = new mThree.effect("switchBack", b.data, 500, function() {
                            mThree.canSelect = true;
                        });
                        (mThree.effects).splice((mThree.effects).length, 0, j);
                    }
                });
                (mThree.effects).splice((mThree.effects).length, 0, i);
                mThree.selected = -1;
            }else if(mThree.selected !== -1) {
                mThree.selected = -1;
            }else{
                mThree.selected = [b, c];
            }
        }
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
        (mThree.selector).width = (mThree.tileSize * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1));
        (mThree.selector).height = (mThree.tileSize * mThree.rows) + (mThree.tileSpacing * (mThree.rows + 1));
        (mThree.selector).addEventListener("click", function(e) {
            mThree.click(e);
        });
        mThree.ended = false;
        mThree.update();
    },
    update: function() { // Updates match-3 as game is played and ends game
        var a = Date.now();
        var b = a - mThree.lastUpdateTime;
        mThree.lastUpdateTime = a;
        var c = (mThree.selector).getContext("2d");
        if(!mThree.ended) {
            c.clearRect(0, 0, (mThree.selector).width, (mThree.selector).height);
            c.strokeRect(0, 0, (mThree.selector).width, (mThree.selector).height);
            var g, h;
            for(var d = 0; d < (mThree.pieces).length; d++) {
                for(var f = 0; f < (mThree.pieces[d]).length; f++) {
                    g = ((d * mThree.tileSize) + ((d + 1) * mThree.tileSpacing));
                    h = ((f * mThree.tileSize) + ((f + 1) * mThree.tileSpacing));
                    c.drawImage(mThree.pieces[d][f].img, g, h);
                    if(Array.isArray(mThree.selected) && mThree.selected[0] === d && mThree.selected[1] === f) {
                        c.beginPath();
                        c.moveTo(g + (mThree.tileSize / 2), h);
                        c.lineTo((g + mThree.tileSize) - mThree.tileSpacing, h);
                        c.quadraticCurveTo(g + mThree.tileSize, h, g + mThree.tileSize, h + mThree.tileSpacing);
                        c.lineTo(g + mThree.tileSize, (h + mThree.tileSize) - mThree.tileSpacing);
                        c.quadraticCurveTo(g + mThree.tileSize, h + mThree.tileSize, (g + mThree.tileSize) - mThree.tileSpacing, h + mThree.tileSize);
                        c.lineTo(g + mThree.tileSpacing, h + mThree.tileSize);
                        c.quadraticCurveTo(g, h + mThree.tileSize, g, (h + mThree.tileSize) - mThree.tileSpacing);
                        c.lineTo(g, h + mThree.tileSpacing);
                        c.quadraticCurveTo(g, h, g + mThree.tileSpacing, h);
                        c.lineTo(g + (mThree.tileSize / 2), h);
                        c.closePath();
                        c.save();
                        c.lineWidth = Math.floor(mThree.tileSpacing / 2);
                        c.strokeStyle = mThree.selectedStyle;
                        c.stroke();
                        c.restore();
                    }
                }
            }
            var j, k, l, m;
            for(var i = 0; i < (mThree.effects).length; i++) {
                if(mThree.effects[i].type === "switch") {
                    j = mThree.effects[i];
                    j.time[0] += b;
                    if(j.time[0] < j.time[1]) {
                        k = [((j.data[0][0] * mThree.tileSize) + ((j.data[0][0] + 1) * mThree.tileSpacing)), ((j.data[0][1] * mThree.tileSize) + ((j.data[0][1] + 1) * mThree.tileSpacing))];
                        l = [((j.data[1][0] * mThree.tileSize) + ((j.data[0][1] + 1) * mThree.tileSpacing)), ((j.data[1][1] * mThree.tileSize) + ((j.data[1][1] + 1) * mThree.tileSpacing))];
                        c.clearRect(k[0], k[1], mThree.tileSize + mThree.tileSpacing, mThree.tileSize + mThree.tileSpacing);
                        c.clearRect(l[0], l[1], mThree.tileSize + mThree.tileSpacing, mThree.tileSize + mThree.tileSpacing);
                        //m = (mThree.tileSize + mThree.tileSpacing) * (j.time[0] / j.time[1]);
                        //m *= (("") ? "" : "");
                        //c.drawImage(mThree.pieces[j.data[1][0]][j.data[1][1]].img, k[1], l[1]); // Animating here
                        //c.drawImage(mThree.pieces[j.data[0][0]][j.data[0][1]].img, k[0], l[0]); // Animating here
                    }else{
                        j.onComplete();
                        for(var n = 0; n < (mThree.effects).length; n++) {
                            if(mThree.effects[n].type === "switch") {
                                break;
                            }
                        }
                        (mThree.effects).splice(n, 1);
                    }
                }else if(mThree.effects[i].type === "switchBack") {
                    j = mThree.effects[i];
                    j.time[0] += b;
                    if(j.time[0] < j.time[1]) {
                        k = [((j.data[0][0] * mThree.tileSize) + ((j.data[0][0] + 1) * mThree.tileSpacing)), ((j.data[0][1] * mThree.tileSize) + ((j.data[0][1] + 1) * mThree.tileSpacing))];
                        l = [((j.data[1][0] * mThree.tileSize) + ((j.data[0][1] + 1) * mThree.tileSpacing)), ((j.data[1][1] * mThree.tileSize) + ((j.data[1][1] + 1) * mThree.tileSpacing))];
                        c.clearRect(k[0], k[1], mThree.tileSize + mThree.tileSpacing, mThree.tileSize + mThree.tileSpacing);
                        c.clearRect(l[0], l[1], mThree.tileSize + mThree.tileSpacing, mThree.tileSize + mThree.tileSpacing);
                    }else{
                        j.onComplete();
                        for(var o = 0; o < (mThree.effects).length; o++) {
                            if(mThree.effects[o].type === "switchBack") {
                                break;
                            }
                        }
                        (mThree.effects).splice(o, 1);
                    }
                }
            }
            window.requestAnimationFrame(mThree.update);
        }else{
            c.clearRect(0, 0, (mThree.selector).width, (mThree.selector).height);
        }
    }
};