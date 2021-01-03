
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
        this.loadTable();
        this.node.loadTable = this.loadTable.bind(this);
        this.node.clearGame = this.clearGame.bind(this);
        this.node.on("SYMBOL_HAS_CLICK", this.symbolClick, this);
        this.node.on("LOAD_TABLE", this.loadTable, this);
        this.node.on("CLEAR_TABLE",this.clearGame,this)

    },
    

    loadTable(){
        this.isFirstClick = false;
        this.matrix = [];
        this.loadMatrix();
        this.symbols = [];
        
        this.symbolSize = this.symbolSize + 10;
        //cc.log(this.symbolSize*(this.colTotal-1));
        this.endX = this.starX + (this.symbolSize * (this.colTotal - 1));
        this.initSymbols();
        
        this.node.on('SYMBOL_HAS_CLICK', (ev) =>{

        });
    },

    initSymbols() {
       
        let x = this.starX;
        let y = this.starY + this.symbolSize;
        for (let i = 0; i < this.spawnCount; ++i) {
            
            if (x < this.endX && i > 0) {
                x += this.symbolSize;
            } else {
                x = this.starX;
                y -= this.symbolSize;
            }
            let item = cc.instantiate(this.symbolPrefab);
           // item.setPosition(cc.v2(x, y));    
            item.runAction(cc.moveTo(3, x,y));

            this.symbols.push(item);
            this.table.addChild(item, i, 'Symbol' + i);
            item.emit("SET_INDEX", i + 1);
            item.emit("SETID", this.matrix[i]);


        }
       
        this.symbolsWins=this.symbols.slice();
        this.isCanClick = true;
    },

    compare2(){

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
            this.symbols[index - 1].emit("HIDDEN_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("HIDDEN_SYMBOL");
            this.sentScore();
            this.removeSymbol(this.symbols[index - 1].name);
            this.removeSymbol(this.symbols[this.symbolFirstIndex - 1].name);
            this.checkWin();            
            
        } else {
            this.symbols[index - 1].emit("RESET_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("RESET_SYMBOL");
        }
        this.isCanClick = true;
    },

    sentScore(){
        this.sentScoreEvent = new cc.Event.EventCustom('ADD_SCORE', true);
        this.node.dispatchEvent(this.sentScoreEvent);
    },
    removeSymbol(symbolName){
        let index=this.symbolsWins.indexOf(symbolName);
        this.symbolsWins.splice(index,1);
    },
    checkWin(){
        if(this.symbolsWins.length==0){
            //cc.log('win');
            this.node.dispatchEvent(new cc.Event.EventCustom('GAME_WIN', true));
        }
    },
    clearGame(){
        for (let i = 0; i < this.spawnCount; ++i) {
            // cc.log(symbols);
            this.symbols[i].emit("HIDDEN_SYMBOL");
           
        }
    }

});
