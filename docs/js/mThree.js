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
    movesOutline: "rgba(250, 25, 25, 0.8)",
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
        font: "20px Ravi Prakash, sans-serif",
        text: "",
        state: 0,
        time: 0,
        total: 1.2
    },
    gameEnded: false,
    init: function() {
        (mThree.canvas).addEventListener("mousemove", mThree.mouse.move);
        (mThree.canvas).addEventListener("mousedown", mThree.mouse.down);
        (mThree.canvas).addEventListener("mouseup", mThree.mouse.up);
        (mThree.canvas).addEventListener("mouseout", mThree.mouse.out);
        for(var i = 0; i < mThree.level.columns; i++) {
            mThree.level.tiles[i] = [];
            for(var j = 0; j < mThree.level.rows; j++) {
                mThree.level.tiles[i][j] = {type: 0, shift: 0, img: document.createElement("img")};
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
                mThree.popup.text = "Tiles reshuffled!";
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
            var c = (mThree.context).measureText("Game Ended!");
            (mThree.context).fillText("Game Ended!", mThree.level.tileSpacing + ((mThree.level.columns * mThree.level.tileSize[0]) - c.width) / 2, mThree.tileSpacing);
            (mThree.context).restore();
        }
    },
    renderTiles: function() {
        for(var i = 0; i < mThree.level.columns; i++) {
            for(var j = 0; j < mThree.level.rows; j++) {
                var shift = mThree.level.tiles[i][j].shift;
                var coord = mThree.getTileCoordinate(i, j, 0, (mThree.animation.time / mThree.animation.total) * shift);
                if(mThree.level.tiles[i][j].type >= 0) {
                    var img = mThree.level.tiles[i][j].img;
                    img.src = mThree.tileData[mThree.level.tiles[i][j].type].url;
                    (mThree.context).save();
                    (mThree.context).globalAlpha = mThree.tileOpacity;
                    (mThree.context).drawImage(img, coord.tilex, coord.tiley);
                    (mThree.context).restore();
                }
                if(mThree.level.selected !== false && mThree.level.selected[0] === i && mThree.level.selected[1] === j) {
                    var imgS = mThree.level.tiles[i][j].img;
                    (mThree.context).drawImage(imgS, coord.tilex, coord.tiley);
                }
            }
        }
        if(mThree.gameState === 2 && (mThree.animation.state === 2 || mThree.animation.state === 3)) {
            var shiftx = mThree.currentMove.column2 - mThree.currentMove.column1;
            var shifty = mThree.currentMove.row2 - mThree.currentMove.row1;
            var coord1 = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, 0, 0);
            var coord2 = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, 0, 0);
            var coord1shift = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, (mThree.animation.time / mThree.animation.total) * shiftx, (mThree.animation.time / mThree.animation.total) * shifty);
            var coord2shift = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, (mThree.animation.time / mThree.animation.total) * -shiftx, (mThree.animation.time / mThree.animation.total) * -shifty);
            var img1 = mThree.level.tiles[mThree.currentMove.column1][mThree.currentMove.row1].img;
            img1.src = mThree.tileData[mThree.level.tiles[mThree.currentMove.column1][mThree.currentMove.row1].type].url;
            var img2 = mThree.level.tiles[mThree.currentMove.column2][mThree.currentMove.row2].img;
            img2.src = mThree.tileData[mThree.level.tiles[mThree.currentMove.column2][mThree.currentMove.row2].type].url;
            (mThree.context).clearRect(coord1.tilex, coord1.tiley, mThree.level.tileSize[0], mThree.level.tileSize[1]);
            (mThree.context).clearRect(coord2.tilex, coord2.tiley, mThree.level.tileSize[0], mThree.level.tileSize[1]);
            (mThree.context).save();
            (mThree.context).globalAlpha = mThree.tileOpacity;
            if(mThree.animation.state === 2) {
                (mThree.context).drawImage(img1, coord1shift.tilex, coord1shift.tiley);
                (mThree.context).drawImage(img2, coord2shift.tilex, coord2shift.tiley);
            }else{
                (mThree.context).drawImage(img2, coord2shift.tilex, coord2shift.tiley);
                (mThree.context).drawImage(img1, coord1shift.tilex, coord1shift.tiley);
            }
            (mThree.context).restore();
        }
    },
    getTileCoordinate: function(column, row, columnoffset, rowoffset) {
        var tilex = (mThree.level.tileSpacing * (column + 1)) + (column + columnoffset) * mThree.level.tileSize[0];
        var tiley = (mThree.level.tileSpacing * (row + 1)) + (row + rowoffset) * mThree.level.tileSize[1];
        return {tilex: tilex, tiley: tiley};
    },
    renderClusters: function() {
        for(var i = 0; i < (mThree.clusters).length; i++) {
            var coord = mThree.getTileCoordinate(mThree.clusters[i].column, mThree.clusters[i].row, 0, 0);
            (mThree.context).save();
            if(mThree.clusters[i].horizontal) {
                var length = coord.tilex + ((mThree.clusters[i].length * mThree.level.tileSize[0]) + ((mThree.clusters[i].length - 1) * mThree.level.tileSpacing));
                (mThree.context).beginPath();
                (mThree.context).moveTo(coord.tilex, coord.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).lineTo(coord.tilex, coord.tiley + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(coord.tilex, coord.tiley, coord.tilex + mThree.level.tileSpacing, coord.tiley);
                (mThree.context).lineTo(length - mThree.level.tileSpacing, coord.tiley);
                (mThree.context).quadraticCurveTo(length, coord.tiley, length, coord.tiley + mThree.level.tileSpacing);
                (mThree.context).lineTo(length, coord.tiley + (mThree.level.tileSize[1] - mThree.level.tileSpacing));
                (mThree.context).quadraticCurveTo(length, coord.tiley + mThree.level.tileSize[1], length - mThree.level.tileSpacing, coord.tiley + mThree.level.tileSize[1]); // Bottom right corner
                (mThree.context).lineTo(coord.tilex + mThree.level.tileSpacing, coord.tiley + mThree.level.tileSize[1]);
                (mThree.context).quadraticCurveTo(coord.tilex, coord.tiley + mThree.level.tileSize[1], coord.tilex, coord.tiley + (mThree.level.tileSize[1] - mThree.level.tileSpacing));
                (mThree.context).lineTo(coord.tilex, coord.tiley + (mThree.level.tileSize[1] / 2));
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.matchOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }else{
                var length2 = coord.tiley + ((mThree.clusters[i].length * mThree.level.tileSize[1]) + ((mThree.clusters[i].length - 1) * mThree.level.tileSpacing));
                (mThree.context).beginPath();
                (mThree.context).moveTo(coord.tilex + (mThree.level.tileSize[0] / 2), coord.tiley);
                (mThree.context).lineTo(coord.tilex + mThree.level.tileSpacing, coord.tiley);
                (mThree.context).quadraticCurveTo(coord.tilex, coord.tiley, coord.tilex, coord.tiley + mThree.level.tileSpacing);
                (mThree.context).lineTo(coord.tilex, length2 - mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(coord.tilex, length2, coord.tilex + mThree.level.tileSpacing, length2);
                (mThree.context).lineTo(coord.tilex + (mThree.level.tileSize[0] - mThree.level.tileSpacing), length2);
                (mThree.context).quadraticCurveTo(coord.tilex + mThree.level.tileSize[0], length2, coord.tilex + mThree.level.tileSize[0], length2 - mThree.level.tileSpacing); // Bottom right corner
                (mThree.context).lineTo(coord.tilex + mThree.level.tileSize[0], coord.tiley + mThree.level.tileSpacing);
                (mThree.context).quadraticCurveTo(coord.tilex + mThree.level.tileSize[0], coord.tiley, coord.tilex + (mThree.level.tileSize[0] - mThree.level.tileSpacing), coord.tiley);
                (mThree.context).lineTo(coord.tilex + (mThree.level.tileSize[0] / 2), coord.tiley);
                (mThree.context).closePath();
                (mThree.context).strokeStyle = mThree.matchOutline;
                (mThree.context).lineWidth = Math.floor(mThree.level.tileSpacing / 2);
                (mThree.context).stroke();
            }
            (mThree.context).restore();
        }
    },
    renderMoves: function() {
        for(var i = 0; i < (mThree.moves).length; i++) {
            var coord1 = mThree.getTileCoordinate(mThree.moves[i].column1, mThree.moves[i].row1, 0, 0);
            var coord2 = mThree.getTileCoordinate(mThree.moves[i].column2, mThree.moves[i].row2, 0, 0);
            (mThree.context).save();
            (mThree.context).strokeStyle = "rgb(250, 25, 25)";
            (mThree.context).beginPath();
            (mThree.context).moveTo(coord1.tilex + mThree.level.tileSize[0] / 2, coord1.tiley + mThree.level.tileSize[1] / 2);
            (mThree.context).lineTo(coord2.tilex + mThree.level.tileSize[0] / 2, coord2.tiley + mThree.level.tileSize[1] / 2);
            (mThree.context).stroke();
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
        var done = false;
        while(!done) {
            for(var i = 0; i < mThree.level.columns; i++) {
                for(var j = 0; j < mThree.level.rows; j++) {
                    mThree.level.tiles[i][j].type = mThree.getRandomTile();
                }
            }
            mThree.resolveClusters();
            mThree.findMoves();
            if((mThree.moves).length > 0) {
                done = true;
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
        for(var j = 0; j < mThree.level.rows; j++) {
            var matchlength = 1;
            for(var i = 0; i < mThree.level.columns; i++) {
                var checkcluster = false;
                if(i === mThree.level.columns - 1) {
                    checkcluster = true;
                }else{
                    if(mThree.level.tiles[i][j].type === mThree.level.tiles[i + 1][j].type && mThree.level.tiles[i][j].type !== -1) {
                        matchlength += 1;
                    }else{
                        checkcluster = true;
                    }
                }
                if(checkcluster) {
                    if(matchlength >= 3) {
                        (mThree.clusters).push({column: i + 1 - matchlength, row: j, length: matchlength, horizontal: true});
                    }
                    matchlength = 1;
                }
            }
        }
        for(var k = 0; k < mThree.level.columns; k++) {
            var matchlength2 = 1;
            for(var l = 0; l < mThree.level.rows; l++) {
                var checkcluster2 = false;
                if(l === mThree.level.rows - 1) {
                    checkcluster2 = true;
                }else{
                    if(mThree.level.tiles[k][l].type === mThree.level.tiles[k][l + 1].type && mThree.level.tiles[k][l].type !== -1) {
                        matchlength2 += 1;
                    }else{
                        checkcluster2 = true;
                    }
                }
                if(checkcluster2) {
                    if(matchlength2 >= 3) {
                        (mThree.clusters).push({column: k, row: l + 1 - matchlength2, length: matchlength2, horizontal: false});
                    }
                    matchlength2 = 1;
                }
            }
        }
    },
    findMoves: function() {
        mThree.moves = [];
        for(var j = 0; j < mThree.level.rows; j++) {
            for(var i = 0; i < mThree.level.columns - 1; i++) {
                mThree.swap(i, j, i + 1, j);
                mThree.findClusters();
                mThree.swap(i, j, i + 1, j);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).push({column1: i, row1: j, column2: i + 1, row2: j});
                }
            }
        }
        for(var i = 0; i < mThree.level.columns; i++) {
            for(var j = 0; j < mThree.level.rows - 1; j++) {
                mThree.swap(i, j, i, j + 1);
                mThree.findClusters();
                mThree.swap(i, j, i, j + 1);
                if((mThree.clusters).length > 0) {
                    (mThree.moves).push({column1: i, row1: j, column2: i, row2: j + 1});
                }
            }
        }
        mThree.clusters = [];
    },
    loopClusters: function(func, ltype) {
        var counted = false;
        for(var i = 0; i < (mThree.clusters).length; i++) {
            var cluster = mThree.clusters[i];
            var coffset = 0;
            var roffset = 0;
            var gtype = mThree.level.tiles[cluster.column][cluster.row].type;
            counted = false;
            for(var j = 0; j < cluster.length; j++) {
                gtype = mThree.level.tiles[cluster.column + coffset][cluster.row + roffset].type;
                func(i, cluster.column + coffset, cluster.row + roffset, cluster);
                if(cluster.horizontal) {
                    coffset++;
                }else{
                    roffset++;
                }
                if(typeof ltype === "string" && ltype === "remove" && mThree.initiated && gtype !== -1 && !counted) {
                    mThree.tileData[gtype].matched();
                    counted = true;
                }
            }
        }
    },
    removeClusters: function() {
        mThree.loopClusters(function(index, column, row, cluster) {
            mThree.level.tiles[column][row].type = -1;
        }, "remove");
        for(var i = 0; i < mThree.level.columns; i++) {
            var shift = 0;
            for(var j = mThree.level.rows - 1; j >= 0; j--) {
                if(mThree.level.tiles[i][j].type === -1) {
                    shift++;
                    mThree.level.tiles[i][j].shift = 0;
                }else{
                    mThree.level.tiles[i][j].shift = shift;
                }
            }
        }
    },
    shiftTiles: function() {
        for(var i = 0; i < mThree.level.columns; i++) {
            for(var j = mThree.level.rows - 1; j >= 0; j--) {
                if(mThree.level.tiles[i][j].type === -1) {
                    mThree.level.tiles[i][j].type = mThree.getRandomTile();
                }else{
                    var shift = mThree.level.tiles[i][j].shift;
                    if(shift > 0) {
                        mThree.swap(i, j, i, j + shift);
                    }
                }
                mThree.level.tiles[i][j].shift = 0;
            }
        }
    },
    getMouseTile: function(pos) {
        var tx = ((pos.x / (mThree.level.tileSize[0] + mThree.level.tileSpacing)) >> 0);
        var ty = ((pos.y / (mThree.level.tileSize[1] + mThree.level.tileSpacing)) >> 0);
        if(tx >= 0 && tx < mThree.level.columns && ty >= 0 && ty < mThree.level.rows) {
            return {valid: true, x: tx, y: ty};
        }
        return {valid: false, x: 0, y: 0};
    },
    canSwap: function(x1, y1, x2, y2) {
        if((Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2)) {
            return true;
        }
        return false;
    },
    swap: function(x1, y1, x2, y2) {
        var typeswap = mThree.level.tiles[x1][y1].type;
        mThree.level.tiles[x1][y1].type = mThree.level.tiles[x2][y2].type;
        mThree.level.tiles[x2][y2].type = typeswap;
    },
    mouseSwap: function(c1, r1, c2, r2) {
        mThree.currentMove = {column1: c1, row1: r1, column2: c2, row2: r2};
        mThree.level.selected = false;
        mThree.animation.state = 2;
        mThree.animation.time = 0;
        mThree.gameState = 2;
    },
    mouse: {
        move: function(e) {
            if(!mThree.gameEnded && mThree.gameState === 1) {
                var pos = mThree.getMousePos(mThree.canvas, e);
                if(mThree.dragging && mThree.level.selected !== false) {
                    var mt = mThree.getMouseTile(pos);
                    if(mt.valid) {
                        if(mThree.canSwap(mt.x, mt.y, mThree.level.selected[0], mThree.level.selected[1])){
                            mThree.mouseSwap(mt.x, mt.y, mThree.level.selected[0], mThree.level.selected[1]);
                        }
                    }
                }
            }
        },
        down: function(e) {
            if(!mThree.gameEnded && mThree.gameState === 1) {
                var pos = mThree.getMousePos(mThree.canvas, e);
                if(!mThree.dragging) {
                    var mt = mThree.getMouseTile(pos);
                    if(mt.valid) {
                        var swapped = false;
                        if(mThree.level.selected !== false) {
                            if(mt.x === mThree.level.selected[0] && mt.y === mThree.level.selected[1]) {
                                mThree.level.selected = false;
                                mThree.dragging = true;
                                return false;
                            }else if(mThree.canSwap(mt.x, mt.y, mThree.level.selected[0], mThree.level.selected[1])) {
                                mThree.mouseSwap(mt.x, mt.y, mThree.level.selected[0], mThree.level.selected[1]);
                                swapped = true;
                            }
                        }
                        if(!swapped) {
                            mThree.level.selected = [mt.x, mt.y];
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
    getMousePos: function(canvas, e) {
        var rect = (mThree.canvas).getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * (mThree.canvas).width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * (mThree.canvas).height)
        };
    }
};
mThree.init();