window.onerror = function(error, url, line) {
    alert(error + ". (Line " + line + ")");
};
var mThree = {
    initiated: [false, false],
    selector: document.querySelector("#mThree"),
    rows: 5,
    columns: 5,
    tileSize: [100, 100],
    tileSpaceing: 5,
    color: {
        background: "rgb(255, 255, 255)",
        outline: "rgba(0, 0, 0, 0.5)"
    },
    types: ["type1", "type2", "type3", "type4", "type5"],
    typeData: {
        type1: ["Type 1", "img/type1.png", function() {
            alert(mThree.typeData.type1[0] + " match made!");
        }],
        type2: ["Type 2", "img/type2.png", function() {
            alert(mThree.typeData.type2[0] + " match made!");
        }],
        type3: ["Type 3", "img/type3.png", function() {
            alert(mThree.typeData.type3[0] + " match made!");
        }],
        type4: ["Type 4", "img/type4.png", function() {
            alert(mThree.typeData.type4[0] + " match made!");
        }],
        type5: ["Type 5", "img/type5.png", function() {
            alert(mThree.typeData.type5[0] + " match made!");
        }]
    },
    tiles: [],
    moves: [],
    clusters: [],
    gameState: 0,
    gameover: false,
    lastFrame: Date.now(),
    dragging: false,
    selected: false,
    currentMove: {},
    animation: {
        state: 0,
        time: 0,
        total: 0.3
    },
    getMousePos: function(a, b) {
        var c = a.getBoundingClientRect();
        return {
          x: b.clientX - c.left,
          y: b.clientY - c.top
        };
    },
    getMouseTile: function(a) {
        var b = Math.floor((a.x - ((mThree.tileSize[0] * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1)))) / mThree.tileSize[0]);
        var c = Math.floor((a.y - ((mThree.tileSize[1] * mThree.rows) + (mThree.tileSpacing * (mThree.rows + 1)))) / mThree.tileSize[1]);
        if(b >= 0 && b < mThree.columns && c >= 0 && c < mThree.rows) {
            return {valid: true, x: b, y: c};
        }else{
            return {valid: false, x: 0, y: 0};
        }
    },
    getTileCoordinate: function(a, b, c, d) {
        var f = ((mThree.tileSize[0] * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1))) + (a + c) * mThree.tileSize[0];
        var g = ((mThree.tileSize[1] * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1))) + (b + d) * mThree.tileSize[1];
        return {tilex: f, tiley: g};
    },
    mouse: {
        move: function(e) {
            var a = mThree.getMousePos(mThree.selector, e);
            if(mThree.dragging && mThree.selected !== false) {
                var b = mThree.getMouseTile(a);
                if(b.valid) {
                    if(mThree.canSwap(b.x, b.y, mThree.selected[0], mThree.selected[1])) {
                        mThree.mouseSwap(b.x, b.y, mThree.selected[0], mThree.selected[1]);
                    }
                }
            }
        },
        down: function(e) {
            var a = mThree.getMousePos(mThree.selector, e);
            if(!mThree.dragging) {
                var b = mThree.getMouseTile(a);
                if(b.valid) {
                    var c = false;
                    if(mThree.selected !== false) {
                        if(b.x === mThree.selected[0] && b.y === mThree.selected[1]) {
                            mThree.selected = false;
                            mThree.dragging = true;
                            return false;
                        }else if(mThree.canSwap(b.x, b.y, mThree.selected[0], mThree.selected[1])) {
                            mThree.mouseSwap(b.x, b.y, mThree.selected[0], mThree.selected[1]);
                            c = true;
                        }
                    }
                    if(!c) {
                        mThree.selected = [b.x, b.y];
                    }
                }else{
                    mThree.selected = false;
                }
                mThree.dragging = true;
            }
        },
        up: function() {
            mThree.dragging = false;
        },
        out: function() {
            mThree.dragging = false;
        }
    },
    getRandomType: function() {
        return mThree.types[Math.round(Math.random() * ((mThree.types).length - 1))];
    },
    findClusters: function() {
        mThree.clusters = [];
        for(var a = 0; a < mThree.rows; a++) {
            var b = 1;
            for(var c = 0; c < mThree.columns; c++) {
                var d = false;
                if(c === mThree.columns - 1) {
                    d = true;
                }else{
                    if(mThree.tiles[c][a].type === mThree.tiles[c + 1][a].type && mThree.tiles[c][a].type !== -1) {
                        b += 1;
                    }else{
                        d = true;
                    }
                }
                if(d) {
                    if(b >= 3) {
                        (mThree.clusters).splice((mThree.clusters).length, 0, {column: c + 1 - b, row: a, length: b, horizontal: true});
                    }
                    b = 1;
                }
            }
        }
        for(var g = 0; g < mThree.columns; g++) {
            var h = 1;
            for(var i = 0; i < mThree.rows; i++) {
                var j = false;
                if(i === mThree.rows - 1) {
                    j = true;
                }else{
                    if(mThree.tiles[g][i].type === mThree.tiles[g][i + 1].type && mThree.tiles[g][i].type !== -1) {
                        h += 1;
                    }else{
                        j = true;
                    }
                }
                if(j) {
                    if(h >= 3) {
                        (mThree.clusters).splice((mThree.clusters).length, 0, {column: g, row: i + 1 - h, length: h, horizontal: false});
                    }
                    h = 1;
                }
            }
        }
    },
    loopClusters: function(a, b) {
        for(var c = 0; c < (mThree.clusters).length; c++) {
            var d = mThree.clusters[c];
            var f = 0;
            var g = 0;
            var h = mThree.tiles[d.column][d.row].type;
            for(var i = 0; i < (d.length); i++) {
                a(c, d.column + f, d.row + g, d);
                if(d.horizontal) {
                    f++;
                }else{
                    g++;
                }
            }
            if(b && b === "remove" && mThree.initiated[1]) {
                mThree.typeData[h][2]();
            }
        }
    },
    removeClusters: function() {
        mThree.loopClusters(function(a, b, c, d) {
            mThree.tiles[b][c].type = -1;
        }, "remove");
        for(var a = 0; a < mThree.columns; a++) {
            var b = 0;
            for(var c = mThree.rows - 1; c >= 0; c--) {
                if(mThree.tiles[a][c].type === -1) {
                    b++;
                    mThree.tiles[a][c].shift = 0;
                }else{
                    mThree.tiles[a][c].shift = b;
                }
            }
        }
    },
    resolveClusters: function() {
        mThree.findClusters();
        while((mThree.clusters).length > 0) {
            mThree.removeClusters();
            mThree.shiftTiles();
            mThree.findClusters();
        }
    },
    shiftTiles: function() {
        for(var a = 0; a < mThree.columns; a++) {
            for(var b = mThree.rows - 1; b >= 0; b--) {
                if(mThree.tiles[a][b].type === -1) {
                    mThree.tiles[a][b].type = mThree.getRandomType();
                }else{
                    var c = mThree.tiles[a][b].shift;
                    if(c > 0) {
                        mThree.swap(a, b, a, b + c);
                    }
                }
                mThree.tiles[a][b].shift = 0;
            }
        }
    },
    swap: function(a, b, c, d) {
        var f = mThree.tiles[a][b].type;
        mThree.tiles[a][b].type = mThree.tiles[c][d].type;
        mThree.tiles[c][d].type = f;
    },
    canSwap: function(a, b, c, d) {
        if((Math.abs(a - c) === 1 && b === d) || (Math.abs(b - d) === 1 && a === c)) {
            return true;
        }else{
            return false;
        }
    },
    mouseSwap: function(a, b, c, d) {
        mThree.currentMove = {column1: a, row1: b, column2: c, row2: d};
        mThree.selected = false;
        mThree.animation.state = 2;
        mThree.animation.time = 0;
        mThree.gameState = 2;
    },
    findMoves: function() {
        mThree.moves = [];
        for(var a = 0; a < mThree.rows; a++) {
            for(var b = 0; b < mThree.columns - 1; b++) {
                mThree.swap(b, a, b + 1, a);
                mThree.findClusters();
                mThree.swap(b, a, b + 1, a);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).splice((mThree.moves).length, 0, {column1: b, row1: a, column2: b + 1, row2: a});
                }
            }
        }
        for(var c = 0; c < mThree.columns; c++) {
            for(var d = 0; d < mThree.rows - 1; d++) {
                mThree.swap(c, d, c, d + 1);
                mThree.findClusters();
                mThree.swap(c, d, c, d + 1);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).splice((mThree.moves).length, 0, {column1: c, row1: d, column2: c, row2: d + 1});
                }
            }
        }
        mThree.clusters = [];
    },
    init: function() {
        if(!mThree.initiated[0]) {
            mThree.initiated[0] = true;
            (mThree.selector).addEventListener("mousemove", mThree.mouse.move);
            (mThree.selector).addEventListener("mousedown", mThree.mouse.down);
            (mThree.selector).addEventListener("mouseup", mThree.mouse.up);
            (mThree.selector).addEventListener("mouseout", mThree.mouse.out);
        }
        (mThree.selector).width = (mThree.tileSize * mThree.columns) + (mThree.tileSpacing * (mThree.columns + 1));
        (mThree.selector).height = (mThree.tileSize * mThree.rows) + (mThree.tileSpacing * (mThree.rows + 1));
        mThree.tiles = [];
        for(var a = 0; a < mThree.columns; a++) {
            mThree.tiles[a] = [];
            for(var b = 0; b < mThree.rows; b++) {
                mThree.tiles[a][b] = {
                    type: 0,
                    img: document.createElement("img"),
                    shift: 0
                };
            }
        }
        mThree.gameState = 1;
        mThree.gameover = false;
        mThree.create();
        mThree.findMoves();
        mThree.findClusters();
        mThree.main(0);
    },
    create: function() {
        var a = false;
        while(!a) {
            for(var b = 0; b < mThree.columns; b++) {
                for(var c = 0; c < mThree.rows; c++) {
                    mThree.tiles[b][c].type = mThree.getRandomType();
                    (mThree.tiles[b][c].img).src = mThree.typeData[mThree.tiles[b][c].type][1];
                }
            }
            mThree.resolveClusters();
            mThree.findMoves();
            if((mThree.moves).length > 0) {
                a = true;
            }
        }
    },
    main: function(a) {
        if(!mThree.initiated[1]) {
            mThree.initiated[1] = true;
        }
        if(!mThree.gameover) {
            mThree.update(a);
            mThree.render();
            window.requestAnimationFrame(mThree.main);
        }else{
            ((mThree.selector).getContext("2d")).clearRect(0, 0, (mThree.selector).width, (mThree.selector).height);
        }
    },
    update: function(a) {
        var b = (a - mThree.lastFrame) / 1000;
        mThree.lastframe = a;
        if(mThree.gameState === 1) {
            if((mThree.moves).length <= 0) {
                alert("No matches left, reshuffling now.");
                mThree.create();
            }
        }else if(mThree.gameState === 2) {
            mThree.animation.time += b;
            if(mThree.animation.state === 0) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.findClusters();
                    if((mThree.clusters).length > 0) {
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
        var a = mThree.selector;
        var b = a.getContext("2d");
        b.save();
        b.fillStyle = mThree.color.background;
        b.fillRect(0, 0, a.width, a.height);
        b.restore();
        for(var c = 0; c < mThree.columns; c++) {
            for(var d = 0; d < mThree.rows; d++) {
                var f = mThree.tiles[c][d].shift;
                var g = mThree.getTileCoordinate(c, d, 0, (mThree.animation.time / mThree.animation.total) * f);
                if(mThree.tiles[c][d].type !== -1) {
                    b.drawImage(mThree.tiles[c][d].img, g.tilex, g.tiley);
                }
                if(mThree.selected !== false && mThree.selected[0] === c && mThree.selected[1] === d) {
                    b.beginPath();
                    b.moveTo(g.tilex + (mThree.tileSize[0] / 2), g.tiley);
                    b.lineTo((g.tilex + mThree.tileSize[0]) - mThree.tileSpacing, g.tiley);
                    b.quadraticCurveTo(g.tilex + mThree.tileSize[0], g.tiley, g.tilex + mThree.tileSize[0], g.tiley + mThree.tileSpacing);
                    b.lineTo(g.tilex + mThree.tileSize[0], (g.tiley + mThree.tileSize[1]) - mThree.tileSpacing);
                    b.quadraticCurveTo(g.tilex + mThree.tileSize[0], g.tiley + mThree.tileSize[1], (g.tilex + mThree.tileSize[0]) - mThree.tileSpacing, g.tiley + mThree.tileSize[1]);
                    b.lineTo(g.tilex + mThree.tileSpacing, g.tiley + mThree.tileSize);
                    b.quadraticCurveTo(g.tilex, g.tiley + mThree.tileSize[1], g.tilex, (g.tiley + mThree.tileSize[1]) - mThree.tileSpacing);
                    b.lineTo(g.tilex, g.tiley + mThree.tileSpacing);
                    b.quadraticCurveTo(g.tilex, g.tiley, g.tilex + mThree.tileSpacing, g.tiley);
                    b.lineTo(g.tilex + (mThree.tileSize[0] / 2), g.tiley);
                    b.closePath();
                    b.save();
                    b.lineWidth = Math.floor(mThree.tileSpacing / 2);
                    b.strokeStyle = mThree.color.outline;
                    b.stroke();
                    b.restore();
                }
            }
        }
        if(mThree.gamestate === 2 && (mThree.animation.state === 2 || mThree.animation.state === 3)) {
            var h = mThree.currentMove.column2 - mThree.currentMove.column1;
            var i = mThree.currentMove.row2 - mThree.currentMove.row1;
            var j = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, (mThree.animation.time / mThree.animation.total) * h, (mThree.animation.time / mThree.animation.total) * i);
            var k = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, (mThree.animation.time / mThree.animation.total) * -h, (mThree.animation.time / mThree.animation.total) * -i);
            if(mThree.animation.state === 2) {
                b.drawImage(mThree.tiles[mThree.currentMove.column1][mThree.currentMove.row1].img, j.tilex, j.tiley);
                b.drawImage(mThree.tiles[mThree.currentMove.column2][mThree.currentMove.row2].img, k.tilex, k.tiley);
            }else{
                b.drawImage(mThree.tiles[mThree.currentMove.column2][mThree.currentMove.row2].img, k.tilex, k.tiley);
                b.drawImage(mThree.tiles[mThree.currentMove.column1][mThree.currentMove.row1].img, j.tilex, j.tiley);
            }
        }
        if((mThree.clusters).length <= 0 && mThree.gamestate === 1) {
            for(var l = 0; l < (mThree.moves).length; l++) {
                var m = mThree.getTileCoordinate(mThree.moves[l].column1, mThree.moves[l].row1, 0, 0);
                var n = mThree.getTileCoordinate(mThree.moves[l].column2, mThree.moves[l].row2, 0, 0);
                b.beginPath();
                b.moveTo(m.tilex + mThree.tileSize[0] / 2, m.tiley + mThree.tileSize[1] / 2);
                b.lineTo(n.tilex + mThree.tileSize[0] / 2, n.tiley + mThree.tileSize[1] / 2);
                b.closePath();
                b.save();
                b.strokeStyle = mThree.color.outline;
                b.stroke();
                b.restore();
            }
        }
    }
};