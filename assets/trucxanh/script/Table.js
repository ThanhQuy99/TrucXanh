
cc.Class({
    extends: cc.Component,
    properties: {
        table: cc.Node,
        symbolPrefab: cc.Prefab,
        spawnCount: 0,
        widthStep: 100,
        heightStep: 100,
        delayTime: 0,
        numberOfCol: 0,
        numberOfRow: 0,
    },

    onLoad() {
        this.startX = - (this.numberOfCol / 2 - 0.5) * this.widthStep

        this.startY = (this.numberOfRow / 2 - 0.5) * this.heightStep;

        this.node.on("SYMBOL_HAS_CLICK", this.symbolClick, this);
        this.node.on("RESET_TABLE", this.resetTable, this);
        this.loadTable();
    },


    loadTable() {
        //! call once 
        this.isFirstClick = false;
        this.matrix = [];
        this.symbols = [];
        this.initSymbols();
    },

    initSymbols() {
        //! call once 
        for (let i = this.spawnCount - 1; i >= 0; i--) {
            let item = cc.instantiate(this.symbolPrefab);
            this.symbols.unshift(item);
            this.table.addChild(item);
            item.emit("SET_INDEX", i + 1);
            item.emit("SET_ID", this.matrix[i]);
            item.emit("HIDDEN_SYMBOL");
        }
        this.symbolsWins = this.symbols.slice();
        this.isCanClick = false;
    },

    resetTable() {

        // todo 
        // shuffler
        this.symbolsWins = this.symbols.slice();
        this.shuffleMatrix();
        this.hiddenListSymbols();
        this.isCanClick = false;
        // reset symbols data: id ( texture )
        for (let i = 0; i < this.spawnCount; ++i) {
            const symbol = this.symbols[i];
            symbol.emit("SET_ID", this.matrix[i]);
            symbol.setPosition(0, 0);
            symbol.emit("SHOW_COVER");
        }
        this.showSymbols();
    },
    showSymbols() {
        for (let i = this.spawnCount - 1; i >= 0; i--) {
            const symbol = this.symbols[i];
            symbol.emit("ENABLED_SYMBOL");
            symbol.emit("RESET_SYMBOL", this.spawnCount - i);
        }
        this.scheduleOnce(() => {
            this.moveListSymbol();
        }, 0.1 * this.symbols.length)
    },

    moveListSymbol() {
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            const pos = this._getPosByIndex(i);
            symbol.runAction(cc.sequence(
                cc.delayTime(0.1 * i),
                cc.moveTo(0.3, pos).easing(cc.easeBackOut()),
                cc.callFunc(() => {
                    if (i === this.symbols.length - 1) {
                        this.isCanClick = true;
                    }
                })
            ))
        }
    },

    _getPosByIndex(index) {
        const col = index % this.numberOfCol;
        const row = Math.floor(index / this.numberOfCol)

        const x = this.startX + (col * this.widthStep);
        const y = this.startY - (row * this.heightStep);
        return cc.v2(x, y);
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
            this.symbols[index - 1].emit("DISABLED_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("DISABLED_SYMBOL");
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
