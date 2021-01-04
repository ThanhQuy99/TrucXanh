
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
        this.node.on("SYMBOL_HAS_CLICK", this.symbolClick, this);
        this.node.on("RESET_TABLE", this.resetTable, this);
        this.loadTable();
    },


    loadTable() {
        //! call once 
        this.isFirstClick = false;
        this.matrix = [];
        this.shuffleMatrix();
        this.symbols = [];
        this.endX = this.starX + (this.symbolSize * (this.colTotal - 1));
        this.initSymbols();
      
    },

    initSymbols() {
         //! call once 
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

    resetTable(){
       
        // todo 
        // shuffer
        this.shuffleMatrix();
        // reset symbols data: id ( texture )
        for (let i = 0; i < this.spawnCount; ++i) {
            const symbol = this.symbols[i];
            symbol.emit("SETID", this.matrix[i]);
            symbol.emit("HIDDEN_SYMBOL");
            symbol.emit("RESET_COVER");
        }
        this.resetListSymbol();
        //this.moveListSymbol();
        this.scheduleOnce(this.moveListSymbol, 0.1 * this.symbols.length);
        this.scheduleOnce(() => { this.isCanClick = true }, 0.3 * this.symbols.length);
        // active

        // event : can click again

    },


    moveListSymbol() {
        //  cc.log('move');
        this.x = this.starX;
        this.y = this.starY + this.symbolSize;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            if (this.x < this.endX && i > 0) {
                this.x += this.symbolSize;
            } else {
                this.x = this.starX;
                this.y -= this.symbolSize;
            }
            const pos = cc.v2(this.x, this.y);
            symbol.runAction(cc.sequence(
                cc.delayTime(0.2 * i),
                cc.moveTo(0.2, pos).easing(cc.easeSineInOut()),
            ))
        }

    },

    resetListSymbol() {
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.emit("RESET_SYMBOL", i);
        }

    },


    hiddenListSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].emit("HIDDEN_SYMBOL");
        }
    },


    shuffleMatrix() {
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
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },


    symbolClick(ev) {
        ev.stopPropagation();
        const symbol = ev.getUserData();
        if (!this.isCanClick) return;
        //cc.log(this.symbolFirstIndex);

        this.node.dispatchEvent(new cc.Event.EventCustom('PLAY_SHOT_AUDIO', true));
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
            this.symbols[index - 1].emit("HIDDEN_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("HIDDEN_SYMBOL");
            this.sentScore(true);
            this.removeSymbol(this.symbols[index - 1].name);
            this.removeSymbol(this.symbols[this.symbolFirstIndex - 1].name);
            this.checkWin();
            this.node.dispatchEvent(new cc.Event.EventCustom('PLAY_BREAK_AUDIO', true));

        } else {
            this.symbols[index - 1].emit("RESET_COVER");
            this.symbols[this.symbolFirstIndex - 1].emit("RESET_COVER");
            this.sentScore(false);
            this.node.dispatchEvent(new cc.Event.EventCustom('PLAY_DEATH_AUDIO', true));
        }
        this.isCanClick = true;
    },

    sentScore(type) {
       // cc.log(type);
            this.sentScoreEvent = new cc.Event.EventCustom('UPDATE_SCORE', true);
            this.sentScoreEvent.setUserData({
                isCorrect: type,
            });
            this.node.dispatchEvent(this.sentScoreEvent);
    },
    removeSymbol(symbolName) {
        let index = this.symbolsWins.indexOf(symbolName);
        this.symbolsWins.splice(index, 1);
    },
    checkWin() {
        if (this.symbolsWins.length == 0) {
            this.node.dispatchEvent(new cc.Event.EventCustom('GAME_WIN', true));
        }
    },

});
