window.onerror = function(error, url, line) {
    alert(error + " (Line " + line + ")");
};
var mThree = {
    canvas: document.getElementById("mThree"),
    context: document.getElementById("mThree").getContext("2d"),
    lastFrame: 0,
    dragging: false,
    level: {
        columns: 5,
        rows: 5,
        tileWidth: 100,
        tileHeight: 100,
        tileSpacing: 5,
        tiles: [],
        selected: false
    },
    tilecolors: [[255, 128, 128],
                [128, 255, 128],
                [128, 128, 255],
                [255, 255, 128],
                [255, 128, 255],
                [128, 255, 255],
                [255, 255, 255]],
    clusters: [],
    moves: [],
    currentMove: {column1: 0, row1: 0, column2: 0, row2: 0},
    gameState: 0,
    score: 0,
    animation: {
        state: 0,
        time: 0,
        total: 0.3
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
                mThree.level.tiles[i][j] = {type: 0, shift: 0};
            }
        }
        mThree.newGame();
        mThree.main(0);
    },
    main: function(tframe) {
        mThree.update(tframe);
        mThree.render();
        window.requestAnimationFrame(mThree.main);
    },
    update: function(tframe) {
        var dt = (tframe - mThree.lastFrame) / 1000;
        mThree.lastFrame = tframe;
        if(mThree.gameState === 1) {
            if((mThree.moves).length <= 0) {
                mThree.newGame(mThree.score);
            }
        }else if(mThree.gameState === 2) {
            mThree.animation.time += dt;
            if(mThree.animation.state === 0) {
                if(mThree.animation.time > mThree.animation.total) {
                    mThree.findClusters();
                    if((mThree.clusters).length > 0) {
                        for(var i = 0; i < (mThree.clusters).length; i++) {
                            mThree.score += 10 * (mThree.clusters[i].length - 2);
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
        if(mThree.gameEnded) {
            (mThree.context).fillStyle = "rgba(0, 0, 0, 0.8)";
            (mThree.context).fillRect(mThree.level.tileSpacing, mThree.level.tileSpacing, mThree.level.columns * mThree.level.tileWidth, mThree.level.rows * mThree.level.tileHeight);
            (mThree.context).fillStyle = "#ffffff";
            (mThree.context).font = "24px Verdana";
            var textdim = (mThree.context).measureText("Game Ended!");
            (mThree.context).fillText("Game Ended!", mThree.level.tileSpacing + ((mThree.level.columns * mThree.level.tileWidth) - textdim.width) / 2, mThree.tileSpacing);
        }
    },
    renderTiles: function() {
        for(var i = 0; i < mThree.level.columns; i++) {
            for(var j = 0; j < mThree.level.rows; j++) {
                var shift = mThree.level.tiles[i][j].shift;
                var coord = mThree.getTileCoordinate(i, j, 0, (mThree.animation.time / mThree.animation.total) * shift);
                if(mThree.level.tiles[i][j].type >= 0) {
                    var col = mThree.tilecolors[mThree.level.tiles[i][j].type];
                    mThree.drawTile(coord.tilex, coord.tiley, col[0], col[1], col[2]);
                }
                if(mThree.level.selected !== false) {
                    if(mThree.level.selected[0] === i && mThree.level.selected[1] === j) {
                        mThree.drawTile(coord.tilex, coord.tiley, 255, 0, 0);
                    }
                }
            }
        }
        if(mThree.gameState === 2 && (mThree.animation.state === 2 || mThree.animation.state === 3)) {
            var shiftx = mThree.currentMove.column2 - mThree.currentMove.column1;
            var shifty = mThree.currentMove.row2 - mThree.currentMove.row1;
            var coord1 = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, 0, 0);
            var coord1shift = mThree.getTileCoordinate(mThree.currentMove.column1, mThree.currentMove.row1, (mThree.animation.time / mThree.animation.total) * shiftx, (mThree.animation.time / mThree.animation.total) * shifty);
            var col1 = mThree.tilecolors[mThree.level.tiles[mThree.currentMove.column1][mThree.currentMove.row1].type];
            var coord2 = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, 0, 0);
            var coord2shift = mThree.getTileCoordinate(mThree.currentMove.column2, mThree.currentMove.row2, (mThree.animation.time / mThree.animation.total) * -shiftx, (mThree.animation.time / mThree.animation.total) * -shifty);
            var col2 = mThree.tilecolors[mThree.level.tiles[mThree.currentMove.column2][mThree.currentMove.row2].type];
            mThree.drawTile(coord1.tilex, coord1.tiley, 0, 0, 0);
            mThree.drawTile(coord2.tilex, coord2.tiley, 0, 0, 0);
            if(mThree.animation.state === 2) {
                mThree.drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
                mThree.drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
            }else{
                mThree.drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
                mThree.drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
            }
        }
    },
    getTileCoordinate: function(column, row, columnoffset, rowoffset) {
        var tilex = mThree.level.tileSpacing + (column + columnoffset) * mThree.level.tileWidth;
        var tiley = mThree.level.tileSpacing + (row + rowoffset) * mThree.level.tileHeight;
        return {tilex: tilex, tiley: tiley};
    },
    drawTile: function(x, y, r, g, b) {
        (mThree.context).fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        (mThree.context).fillRect(x, y, mThree.level.tileWidth, mThree.level.tileHeight);
    },
    renderClusters: function() {
        for(var i = 0; i < (mThree.clusters).length; i++) {
            var coord = mThree.getTileCoordinate(mThree.clusters[i].column, mThree.clusters[i].row, 0, 0);
            if(mThree.clusters[i].horizontal) {
                (mThree.context).fillStyle = "#00ff00";
                (mThree.context).fillRect(coord.tilex + mThree.level.tileWidth / 2, coord.tiley + mThree.level.tileHeight / 2 - 4, (mThree.clusters[i].length - 1) * mThree.level.tileWidth, 8);
            }else{
                (mThree.context).fillStyle = "#0000ff";
                (mThree.context).fillRect(coord.tilex + mThree.level.tileWidth / 2 - 4, coord.tiley + mThree.level.tileHeight / 2, 8, (mThree.clusters[i].length - 1) * mThree.level.tileHeight);
            }
        }
    },
    newGame: function(a) {
        mThree.score = ((a) ? a : 0);
        mThree.gameState = 1;
        mThree.gameEnded = false;
        mThree.createLevel();
        mThree.findMoves();
        mThree.findClusters(); 
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
        return Math.round(Math.random() * ((mThree.tilecolors).length - 1));
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
        for(var i = 0; i < mThree.level.columns; i++) {
            var matchlength = 1;
            for(var j = 0; j < mThree.level.rows; j++) {
                var checkcluster = false;
                if(j === mThree.level.rows - 1) {
                    checkcluster = true;
                }else{
                    if(mThree.level.tiles[i][j].type === mThree.level.tiles[i][j + 1].type && mThree.level.tiles[i][j].type !== -1) {
                        matchlength += 1;
                    }else{
                        checkcluster = true;
                    }
                }
                if(checkcluster) {
                    if(matchlength >= 3) {
                        (mThree.clusters).push({column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false});
                    }
                    matchlength = 1;
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
            for (var j = 0; j < mThree.level.rows - 1; j++) {
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
    loopClusters: function(func) {
        for(var i = 0; i < (mThree.clusters).length; i++) {
            var cluster = mThree.clusters[i];
            var coffset = 0;
            var roffset = 0;
            for(var j = 0; j < cluster.length; j++) {
                func(i, cluster.column+coffset, cluster.row+roffset, cluster);
                if(cluster.horizontal) {
                    coffset++;
                }else{
                    roffset++;
                }
            }
        }
    },
    removeClusters: function() {
        mThree.loopClusters(function(index, column, row, cluster) { mThree.level.tiles[column][row].type = -1; });
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
        var tx = Math.floor((pos.x - mThree.level.tileSpacing) / mThree.level.tileWidth);
        var ty = Math.floor((pos.y - mThree.level.tileSpacing) / mThree.level.tileHeight);
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
            if(!mThree.gameEnded) {
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
            if(!mThree.gameEnded) {
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
                            }else if(mThree.canSwap(mt.x, mt.y, mThree.level.selected[0], mThree.level.selected[1])){
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