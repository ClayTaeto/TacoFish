var mThree = {
    initiated: false,
    canvas: document.getElementById("mThree"),
    context: document.getElementById("mThree").getContext("2d"),
    lastFrame: 0,
    dragging: false,
    level: {
        columns: 5,
        rows: 5,
        tileSize: [100, 100],
        tileSpacing: 5,
        tiles: [],
        selected: false
    },
    tileOpacity: 0.6,
    matchOutline: "rgba(0, 0, 0, 0.8)",
    showMoves: false,
    movesOutline: "rgba(25, 25, 250, 0.8)",
    tileData: [{url: "img/type1.png", matched: function() {
        (mThree.matchesMade).push(1);
    }}, {url: "img/type2.png", matched: function() {
        (mThree.matchesMade).push(2);
    }}, {url: "img/type3.png", matched: function() {
        (mThree.matchesMade).push(3);
    }}, {url: "img/type4.png", matched: function() {
        (mThree.matchesMade).push(4);
    }}, {url: "img/type5.png", matched: function() {
        (mThree.matchesMade).push(5);
    }}],
    clusters: [],
    moves: [],
    currentMove: {column1: 0, row1: 0, column2: 0, row2: 0},
    gameState: 0,
    score: 0,
    matchesMade: [],
    animation: {
        state: 0,
        time: 0,
        total: 0.3
    },
    popup: {
        font: "30px Ravi Prakash, sans-serif",
        text: "",
        state: 0,
        time: 0,
        total: 2.4
    },
    gameEnded: false,
    init: function(a) {
        mThree.canvas = (a) ? a : document.getElementById("mThree");
        mThree.context = (mThree.canvas).getContext("2d");
        (mThree.canvas).addEventListener("mousemove", mThree.mouse.move);
        (mThree.canvas).addEventListener("mousedown", mThree.mouse.down);
        (mThree.canvas).addEventListener("mouseup", mThree.mouse.up);
        (mThree.canvas).addEventListener("mouseout", mThree.mouse.out);
        for(var b = 0; b < mThree.level.columns; b++) {
            mThree.level.tiles[b] = [];
            for(var c = 0; c < mThree.level.rows; c++) {
                mThree.level.tiles[b][c] = {type: 0, shift: 0, img: document.createElement("img")};
            }
        }
        mThree.newGame();
        mThree.main(0);
    },
    main: function(a) {
        mThree.update(a);
        mThree.render();
        window.requestAnimationFrame(mThree.main);
    },
    update: function(a) {
        var b = (a - mThree.lastFrame) / 1000;
        mThree.lastFrame = a;
        if(mThree.popup.state === 1) {
            mThree.popup.time += b;
            mThree.popup.state = 0;
        }else if(mThree.popup.time > 0) {
            mThree.popup.time += b;
            if(mThree.popup.time > mThree.popup.total) {
                mThree.popup.time = 0;
                mThree.popup.text = "";
            }
        }
        if(mThree.gameState === 1) {
            if((mThree.moves).length <= 0) {
                mThree.popup.state = 1;
                mThree.popup.text = "No matches left, tiles reshuffled";
                mThree.newGame(mThree.score);
            }
        }else if(mThree.gameState === 2) {
            mThree.animation.time += b;
            if(mThree.animation.state === 0) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.findClusters();
                    if((mThree.clusters).length > 0) {
                        for(var c = 0; c < (mThree.clusters).length; c++) {
                            mThree.score += 10 * (mThree.clusters[c].length - 2);
                        }
                        mThree.removeClusters();
                        mThree.animation.state = 1;
                    }else{
                        mThree.gameState = 1;
                    }
                    mThree.animation.time = 0;
                }
            }else if(mThree.animation.state === 1) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.shiftTiles();
                    mThree.animation.state = 0;
                    mThree.animation.time = 0;
                    mThree.findClusters();
                    if((mThree.clusters).length <= 0) {
                        mThree.gameState = 1;
                    }
                }
            }else if(mThree.animation.state === 2) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.swap(mThree.currentMove.column1, mThree.currentMove.row1, mThree.currentMove.column2, mThree.currentMove.row2);
                    mThree.findClusters();
                    if((mThree.clusters).length > 0) {
                        mThree.animation.state = 0;
                        mThree.animation.time = 0;
                        mThree.gameState = 2;
                    }else{
                        mThree.animation.state = 3;
                        mThree.animation.time = 0;
                    }
                    mThree.findMoves();
                    mThree.findClusters();
                }
            }else if(mThree.animation.state === 3) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.swap(mThree.currentMove.column1, mThree.currentMove.row1, mThree.currentMove.column2, mThree.currentMove.row2);
                    mThree.gameState = 1;
                }
            }
            mThree.findMoves();
            mThree.findClusters();
        }
    },
    render: function() {
        (mThree.context).clearRect(0, 0, (mThree.canvas).width, (mThree.canvas).height);
        mThree.renderTiles();
        mThree.renderClusters();
        if(mThree.showMoves && (mThree.clusters).length <= 0 && mThree.gameState === 1) {
            mThree.renderMoves();
        }
        if(mThree.popup.time > 0) {
            (mThree.context).save();
            if(mThree.popup.time > (mThree.popup.total / 3)) {
                var a = mThree.popup.total / 3;
                (mThree.context).fillStyle = "rgba(0, 0, 0, " + (1 - ((mThree.popup.time - a) / (mThree.popup.total - a))).toFixed(2) + ")";
            }else{
                (mThree.context).fillStyle = "rgb(0, 0, 0)";
            }
            (mThree.context).font = mThree.popup.font;
            (mThree.context).textAlign = "center";
            (mThree.context).beginPath();
            (mThree.context).moveTo((mThree.canvas).width / 2, 0);
            (mThree.context).lineTo((mThree.canvas).width / 2, (mThree.canvas).height);
            (mThree.context).closePath();
            (mThree.context).fillText(mThree.popup.text, (mThree.canvas).width / 2, (mThree.canvas).height / 4);
            (mThree.context).restore();
        }
        if(mThree.gameEnded) {
            (mThree.context).save();
            (mThree.context).fillStyle = "rgba(0, 0, 0, 0.8)";
            (mThree.context).fillRect(mThree.level.tileSpacing, mThree.level.tileSpacing, mThree.level.columns * mThree.level.tileSize[0], mThree.level.rows * mThree.level.tileSize[1]);
            (mThree.context).fillStyle = "rgba(255, 255, 255, 0.8)";
            (mThree.context).font = mThree.popup.font;
            var b = (mThree.context).measureText("Game Ended!");
            (mThree.context).fillText("Game Ended!", mThree.level.tileSpacing + ((mThree.level.columns * mThree.level.tileSize[0]) - b.width) / 2, mThree.tileSpacing);
            (mThree.context).restore();
        }
    },
    renderTiles: function() {
        for(var a = 0; a < mThree.level.columns; a++) {
            for(var b = 0; b < mThree.level.rows; b++) {
                var c = mThree.level.tiles[a][b].shift;
                var d = mThree.getTileCoordinate(a, b, 0, (mThree.animation.time / mThree.animation.total) * c);
                if(mThree.level.tiles[a][b].type >= 0) {
                    var f = mThree.level.tiles[a][b].img;
                    f.src = mThree.tileData[mThree.level.tiles[a][b].type].url;
                    (mThree.context).save();
                    (mThree.context).globalAlpha = mThree.tileOpacity;
                    (mThree.context).drawImage(f, d.tilex, d.tiley);
                    (mThree.context).restore();
                }
                if(mThree.level.selected !== false && mThree.level.selected[0] === a && mThree.level.selected[1] === b) {
                    (mThree.context).clearRect(d.tilex, d.tiley, mThree.level.tileSize[0], mThree.level.tileSize[1]);
                    var g = mThree.level.tiles[a][b].img;
                    (mThree.context).drawImage(g, d.tilex, d.tiley);
                }
            }
        }
        if(mThree.gameState === 2 && (mThree.animation.state === 2 || mThree.animation.state === 3)) {
            var h = mThree.currentMove.column2 - mThree.currentMove.column1;
            var i = mThree.currentMove.row2 - mThree.currentMove.row1;
            var j = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, 0, 0);
            var k = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, 0, 0);
            var l = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, (mThree.animation.time / mThree.animation.total) * h, (mThree.animation.time / mThree.animation.total) * i);
            var m = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, (mThree.animation.time / mThree.animation.total) * -h, (mThree.animation.time / mThree.animation.total) * -i);
            var n = mThree.level.tiles[mThree.currentMove.column1][mThree.currentMove.row1].img;
            n.src = mThree.tileData[mThree.level.tiles[mThree.currentMove.column1][mThree.currentMove.row1].type].url;
            var o = mThree.level.tiles[mThree.currentMove.column2][mThree.currentMove.row2].img;
            o.src = mThree.tileData[mThree.level.tiles[mThree.currentMove.column2][mThree.currentMove.row2].type].url;
            (mThree.context).clearRect(j.tilex, j.tiley, mThree.level.tileSize[0], mThree.level.tileSize[1]);
            (mThree.context).clearRect(k.tilex, k.tiley, mThree.level.tileSize[0], mThree.level.tileSize[1]);
            (mThree.context).save();
            (mThree.context).globalAlpha = mThree.tileOpacity;
            if(mThree.animation.state === 2) {
                (mThree.context).drawImage(n, l.tilex, l.tiley);
                (mThree.context).drawImage(o, m.tilex, m.tiley);
            }else{
                (mThree.context).drawImage(o, m.tilex, m.tiley);
                (mThree.context).drawImage(n, l.tilex, l.tiley);
            }
            (mThree.context).restore();
        }
    },
    getTileCoordinate: function(a, b, c, d) {
        var f = (mThree.level.tileSpacing * (a + 1)) + (a + c) * mThree.level.tileSize[0];
        var g = (mThree.level.tileSpacing * (b + 1)) + (b + d) * mThree.level.tileSize[1];
        return {tilex: f, tiley: g};
    },
    renderClusters: function() {
        for(var a = 0; a < (mThree.clusters).length; a++) {
            var b = mThree.getTileCoordinate(mThree.clusters[a].column, mThree.clusters[a].row, 0, 0);
            (mThree.context).save();
            if(mThree.clusters[a].horizontal) {
                var c = b.tilex + ((mThree.clusters[a].length * mThree.level.tileSize[0]) + ((mThree.clusters[a].length - 1) * mThree.level.tileSpacing));
                (mThree.context).beginPath();
                (mThree.context).moveTo(b.tilex, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).lineTo(b.tilex, b.tiley + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex, b.tiley, b.tilex + mThree.level.tileSpacing, b.tiley);
                (mThree.context).lineTo(c - mThree.level.tileSpacing, b.tiley);
                (mThree.context).quadraticCurveTo(c, b.tiley, c, b.tiley + mThree.level.tileSpacing);
                (mThree.context).lineTo(c, b.tiley + (mThree.level.tileSize[1] - mThree.level.tileSpacing));
                (mThree.context).quadraticCurveTo(c, b.tiley + mThree.level.tileSize[1], c - mThree.level.tileSpacing, b.tiley + mThree.level.tileSize[1]);
                (mThree.context).lineTo(b.tilex + mThree.level.tileSpacing, b.tiley + mThree.level.tileSize[1]);
                (mThree.context).quadraticCurveTo(b.tilex, b.tiley + mThree.level.tileSize[1], b.tilex, b.tiley + (mThree.level.tileSize[1] - mThree.level.tileSpacing));
                (mThree.context).lineTo(b.tilex, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.matchOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }else{
                var d = b.tiley + ((mThree.clusters[a].length * mThree.level.tileSize[1]) + ((mThree.clusters[a].length - 1) * mThree.level.tileSpacing));
                (mThree.context).beginPath();
                (mThree.context).moveTo(b.tilex + (mThree.level.tileSize[0] / 2), b.tiley);
                (mThree.context).lineTo(b.tilex + mThree.level.tileSpacing, b.tiley);
                (mThree.context).quadraticCurveTo(b.tilex, b.tiley, b.tilex, b.tiley + mThree.level.tileSpacing);
                (mThree.context).lineTo(b.tilex, d - mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex, d, b.tilex + mThree.level.tileSpacing, d);
                (mThree.context).lineTo(b.tilex + (mThree.level.tileSize[0] - mThree.level.tileSpacing), d);
                (mThree.context).quadraticCurveTo(b.tilex + mThree.level.tileSize[0], d, b.tilex + mThree.level.tileSize[0], d - mThree.level.tileSpacing);
                (mThree.context).lineTo(b.tilex + mThree.level.tileSize[0], b.tiley + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex + mThree.level.tileSize[0], b.tiley, b.tilex + (mThree.level.tileSize[0] - mThree.level.tileSpacing), b.tiley);
                (mThree.context).lineTo(b.tilex + (mThree.level.tileSize[0] / 2), b.tiley);
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.matchOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }
            (mThree.context).restore();
        }
    },
    renderMoves: function() {
        for(var a = 0; a < (mThree.moves).length; a++) {
            var b = mThree.getTileCoordinate(mThree.moves[a].column1, mThree.moves[a].row1, 0, 0);
            (mThree.context).save();
            if(mThree.moves[a].horizontal) {
                var c = b.tilex + ((mThree.level.tileSize[0] * 2) + mThree.level.tileSpacing);
                (mThree.context).beginPath();
                (mThree.context).moveTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing);
                (mThree.context).lineTo(c - (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(c - (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing, c - (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).quadraticCurveTo(c - (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing, c - (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing);
                (mThree.context).lineTo(b.tilex + (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.movesOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }else{
                var d = b.tiley + ((mThree.level.tileSize[1] * 2) + mThree.level.tileSpacing);
                (mThree.context).beginPath();
                (mThree.context).moveTo(b.tilex + (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).lineTo(b.tilex + (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, d - (mThree.level.tileSize[1] / 2));
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) + mThree.level.tileSpacing, d - (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2), d - (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, d - (mThree.level.tileSize[1] / 2) + mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, d - (mThree.level.tileSize[1] / 2));
                (mThree.context).lineTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).quadraticCurveTo(b.tilex + (mThree.level.tileSize[0] / 2) - mThree.level.tileSpacing, b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing, b.tilex + (mThree.level.tileSize[0] / 2), b.tiley + (mThree.level.tileSize[1] / 2) - mThree.level.tileSpacing);
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.movesOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }
            (mThree.context).restore();
        }
    },
    newGame: function(a) {
        mThree.initiated = false;
        mThree.score = ((a) ? a : 0);
        mThree.gameState = 1;
        mThree.gameEnded = false;
        mThree.createLevel();
        mThree.findMoves();
        mThree.findClusters();
        mThree.initiated = true;
    },
    createLevel: function() {
        var a = false;
        while(!a) {
            for(var b = 0; b < mThree.level.columns; b++) {
                for(var c = 0; c < mThree.level.rows; c++) {
                    mThree.level.tiles[b][c].type = mThree.getRandomTile();
                }
            }
            mThree.resolveClusters();
            mThree.findMoves();
            if((mThree.moves).length > 0) {
                a = true;
            }
        }
    },
    getRandomTile: function() {
        return Math.round(Math.random() * ((mThree.tileData).length - 1));
    },
    resolveClusters: function() {
        mThree.findClusters();
        while((mThree.clusters).length > 0) {
            mThree.removeClusters();
            mThree.shiftTiles();
            mThree.findClusters();
        }
    },
    findClusters: function() {
        mThree.clusters = [];
        for(var a = 0; a < mThree.level.rows; a++) {
            var b = 1;
            for(var c = 0; c < mThree.level.columns; c++) {
                var d = false;
                if(c === mThree.level.columns - 1) {
                    d = true;
                }else{
                    if(mThree.level.tiles[c][a].type === mThree.level.tiles[c + 1][a].type && mThree.level.tiles[c][a].type !== -1) {
                        b += 1;
                    }else{
                        d = true;
                    }
                }
                if(d) {
                    if(b >= 3) {
                        (mThree.clusters).push({column: c + 1 - b, row: a, length: b, horizontal: true});
                    }
                    b = 1;
                }
            }
        }
        for(var f = 0; f < mThree.level.columns; f++) {
            var g = 1;
            for(var h = 0; h < mThree.level.rows; h++) {
                var i = false;
                if(h === mThree.level.rows - 1) {
                    i = true;
                }else{
                    if(mThree.level.tiles[f][h].type === mThree.level.tiles[f][h + 1].type && mThree.level.tiles[f][h].type !== -1) {
                        g += 1;
                    }else{
                        i = true;
                    }
                }
                if(i) {
                    if(g >= 3) {
                        (mThree.clusters).push({column: f, row: h + 1 - g, length: g, horizontal: false});
                    }
                    g = 1;
                }
            }
        }
    },
    findMoves: function() {
        mThree.moves = [];
        for(var a = 0; a < mThree.level.rows; a++) {
            for(var b = 0; b < mThree.level.columns - 1; b++) {
                mThree.swap(b, a, b + 1, a);
                mThree.findClusters();
                mThree.swap(b, a, b + 1, a);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).push({column1: b, row1: a, column2: b + 1, row2: a, horizontal: true});
                }
            }
        }
        for(var c = 0; c < mThree.level.columns; c++) {
            for(var d = 0; d < mThree.level.rows - 1; d++) {
                mThree.swap(c, d, c, d + 1);
                mThree.findClusters();
                mThree.swap(c, d, c, d + 1);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).push({column1: c, row1: d, column2: c, row2: d + 1, horizontal: false});
                }
            }
        }
        mThree.clusters = [];
    },
    loopClusters: function(a, b) {
        var c = false;
        for(var d = 0; d < (mThree.clusters).length; d++) {
            var f = mThree.clusters[d];
            var g = 0;
            var h = 0;
            var i = mThree.level.tiles[f.column][f.row].type;
            c = false;
            for(var j = 0; j < f.length; j++) {
                i = mThree.level.tiles[f.column + g][f.row + h].type;
                a(d, f.column + g, f.row + h, f);
                if(f.horizontal) {
                    g++;
                }else{
                    h++;
                }
                if(typeof b === "string" && b === "remove" && mThree.initiated && i !== -1 && !c) {
                    mThree.tileData[i].matched();
                    c = true;
                }
            }
        }
    },
    removeClusters: function() {
        mThree.loopClusters(function(a, b, c, d) {
            mThree.level.tiles[b][c].type = -1;
        }, "remove");
        for(var a = 0; a < mThree.level.columns; a++) {
            var b = 0;
            for(var c = mThree.level.rows - 1; c >= 0; c--) {
                if(mThree.level.tiles[a][c].type === -1) {
                    b++;
                    mThree.level.tiles[a][c].shift = 0;
                }else{
                    mThree.level.tiles[a][c].shift = b;
                }
            }
        }
    },
    shiftTiles: function() {
        for(var a = 0; a < mThree.level.columns; a++) {
            for(var b = mThree.level.rows - 1; b >= 0; b--) {
                if(mThree.level.tiles[a][b].type === -1) {
                    mThree.level.tiles[a][b].type = mThree.getRandomTile();
                }else{
                    var c = mThree.level.tiles[a][b].shift;
                    if(c > 0) {
                        mThree.swap(a, b, a, b + c);
                    }
                }
                mThree.level.tiles[a][b].shift = 0;
            }
        }
    },
    getMouseTile: function(a) {
        var b = ((a.x / (mThree.level.tileSize[0] + mThree.level.tileSpacing)) >> 0);
        var c = ((a.y / (mThree.level.tileSize[1] + mThree.level.tileSpacing)) >> 0);
        if(b >= 0 && b < mThree.level.columns && c >= 0 && c < mThree.level.rows) {
            return {valid: true, x: b, y: c};
        }
        return {valid: false, x: 0, y: 0};
    },
    canSwap: function(a, b, c, d) {
        if((Math.abs(a - c) === 1 && b === d) || (Math.abs(b - d) === 1 && a === c)) {
            return true;
        }
        return false;
    },
    swap: function(a, b, c, d) {
        var typeswap = mThree.level.tiles[a][b].type;
        mThree.level.tiles[a][b].type = mThree.level.tiles[c][d].type;
        mThree.level.tiles[c][d].type = typeswap;
    },
    mouseSwap: function(a, b, c, d) {
        mThree.currentMove = {column1: a, row1: b, column2: c, row2: d};
        mThree.level.selected = false;
        mThree.animation.state = 2;
        mThree.animation.time = 0;
        mThree.gameState = 2;
    },
    mouse: {
        move: function(e) {
            if(!mThree.gameEnded && mThree.gameState === 1) {
                var a = mThree.getMousePos(mThree.canvas, e);
                if(mThree.dragging && mThree.level.selected !== false) {
                    var b = mThree.getMouseTile(a);
                    if(b.valid) {
                        if(mThree.canSwap(b.x, b.y, mThree.level.selected[0], mThree.level.selected[1])){
                            mThree.mouseSwap(b.x, b.y, mThree.level.selected[0], mThree.level.selected[1]);
                        }
                    }
                }
            }
        },
        down: function(e) {
            if(!mThree.gameEnded && mThree.gameState === 1) {
                var a = mThree.getMousePos(mThree.canvas, e);
                if(!mThree.dragging) {
                    var b = mThree.getMouseTile(a);
                    if(b.valid) {
                        var c = false;
                        if(mThree.level.selected !== false) {
                            if(b.x === mThree.level.selected[0] && b.y === mThree.level.selected[1]) {
                                mThree.level.selected = false;
                                mThree.dragging = true;
                                return false;
                            }else if(mThree.canSwap(b.x, b.y, mThree.level.selected[0], mThree.level.selected[1])) {
                                mThree.mouseSwap(b.x, b.y, mThree.level.selected[0], mThree.level.selected[1]);
                                c = true;
                            }
                        }
                        if(!c) {
                            mThree.level.selected = [b.x, b.y];
                        }
                    }else{
                        mThree.level.selected = false;
                    }
                    mThree.dragging = true;
                }
            }
        },
        up: function(e) {
            if(!mThree.gameEnded) {
                mThree.dragging = false;
            }
        },
        out: function(e) {
            if(!mThree.gameEnded) {
                mThree.dragging = false;
            }
        }
    },
    getMousePos: function(a, e) {
        var b = a.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - b.left) / (b.right - b.left) * a.width),
            y: Math.round((e.clientY - b.top) / (b.bottom - b.top) * a.height)
        };
    }
};
mThree.init();