
cc.Class({
    extends: cc.Component,
    properties: {
        table: cc.Node,
        symbolPrefab: cc.Prefab,
        spawnCount: 0,
        symbolSize: 0,
        starX: 0,
        starY: 0,
        colTotal: 0,
        delayTime: 0,
    },

    onLoad() {
        // window.item = this;
        this.symbolSize = this.symbolSize + 10;
        //this.loadTable();
        this.node.loadTable = this.loadTable.bind(this);
        this.node.clearGame = this.clearGame.bind(this);
        this.node.on("SYMBOL_HAS_CLICK", this.symbolClick, this);
        this.node.on("LOAD_TABLE", this.loadTable, this);
        this.node.on("CLEAR_TABLE", this.clearGame, this)

    },


    loadTable() {

        this.isFirstClick = false;
        this.matrix = [];
        this.loadMatrix();
        this.symbols = [];
        //cc.log(this.symbolSize*(this.colTotal-1));
        this.endX = this.starX + (this.symbolSize * (this.colTotal - 1));
        this.initSymbols();
        this.node.on('SYMBOL_HAS_CLICK', (ev) => {
        });
        this.resetListSymbol();
        this.scheduleOnce(this.moveListSymbol, 0.1 * this.symbols.length);
        this.scheduleOnce(() => { this.isCanClick = true }, 0.3 * this.symbols.length);


    },

    initSymbols() {

        for (let i = 0; i < this.spawnCount; ++i) {
            let item = cc.instantiate(this.symbolPrefab);

            this.symbols.push(item);
            this.table.addChild(item, i, 'Symbol' + i);
            item.emit("SET_INDEX", i + 1);
            item.emit("SETID", this.matrix[i]);
            item.emit("HIDDEN_SYMBOL");
        }
        this.symbolsWins = this.symbols.slice();
        this.isCanClick = false;


    },
    moveListSymbol() {
        //  cc.log('move');

        this.x = this.starX;
        this.y = this.starY + this.symbolSize;
        for (let i = 0; i < this.symbols.length; i++) {

            // this.moveSymBol(i,x,y)
            //  cc.log(this.x,this.y);
            this._moveSymBol = () => {
                this.moveSymBol(i)
            }
            this.scheduleOnce(this._moveSymBol, 0.2 * i);
        }
        
    },
    moveSymBol(i) {
        if (this.x < this.endX && i > 0) {
            this.x += this.symbolSize;
        } else {
            this.x = this.starX;
            this.y -= this.symbolSize;
        }
        this.symbols[i].runAction(cc.moveTo(0.2, this.x, this.y));
    },

    resetListSymbol() {
        // cc.log('move');
        for (let i = 0; i < this.symbols.length; i++) {
            this._resetSymbolInList = () => {
                this.resetSymbolInList(i)
            }
            this.scheduleOnce(this._resetSymbolInList, 0.1 * i);
        }

    },

    resetSymbolInList(i) {
        this.symbols[i].emit("RESET_SYMBOL");
    },

    hiddenListSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].emit("HIDDEN_SYMBOL");
        }
    },


    loadMatrix() {
        for (let i = 0; i < this.spawnCount; i++) {
            if (i < this.spawnCount / 2) {
                this.matrix[i] = i + 1;
            } else {
                this.matrix[i] = (i - 9);
            }
        }

        this.shuffle(this.matrix);
    },
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },


    symbolClick(ev) {
        ev.stopPropagation();
        const symbol = ev.getUserData();
        if (!this.isCanClick) return;
        //cc.log(this.symbolFirstIndex);
        const { id, index } = symbol;
        if (!this.isFirstClick) {
            this.symbols[index - 1].emit("HIDDEN_COVER");
            this.symbolFirstID = id;
            this.symbolFirstIndex = index;
            this.isFirstClick = true;
        } else if (this.symbolFirstIndex != index) {
            this.isCanClick = false;
            this.symbols[index - 1].emit("HIDDEN_COVER");

            this._callback = () => {
                this.compare(id, index)
            }
            this.scheduleOnce(this._callback, this.delayTime);
            this.isFirstClick = false;

        } else {
            this.isFirstClick = true;
        }
    },

    compare(id, index) {
        if (id == this.symbolFirstID) {
            this.symbols[index - 1].emit("DESTROY_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("DESTROY_SYMBOL");
            this.sentScore(true);
            this.removeSymbol(this.symbols[index - 1].name);
            this.removeSymbol(this.symbols[this.symbolFirstIndex - 1].name);
            this.checkWin();

        } else {
            this.symbols[index - 1].emit("RESET_COVER");
            this.symbols[this.symbolFirstIndex - 1].emit("RESET_COVER");
            this.sentScore(false);
        }
        this.isCanClick = true;
    },

    sentScore(type) {
        if (type) {
            this.sentScoreEvent = new cc.Event.EventCustom('ADD_SCORE', true);
            this.node.dispatchEvent(this.sentScoreEvent);
        } else {
            this.sentScoreEvent = new cc.Event.EventCustom('REMOVE_SCORE', true);
            this.node.dispatchEvent(this.sentScoreEvent);
        }

    },
    removeSymbol(symbolName) {
        let index = this.symbolsWins.indexOf(symbolName);
        this.symbolsWins.splice(index, 1);
    },
    checkWin() {
        if (this.symbolsWins.length == 0) {
            //cc.log('win');
            this.node.dispatchEvent(new cc.Event.EventCustom('GAME_WIN', true));
        }
    },
    clearGame() {
        for (let i = 0; i < this.spawnCount; ++i) {
            // cc.log(symbols);
            this.symbols[i].emit("DESTROY_SYMBOL");
        }
    }

});
