
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
    },

    onLoad() {
        window.item = this;
        this.isFirstClick = false;
        this.matrix = [];
        this.loadMatrix();
        this.symbols = [];
        this.symbolSize = this.symbolSize + 10;
        //cc.log(this.symbolSize*(this.colTotal-1));
        this.endX = this.starX + (this.symbolSize * (this.colTotal - 1));
        this.initSymbols();
        this.node.on("SYMBOL_HAS_CLICK", this.symbolClick, this);
        // this.node.on('SYMBOL_HAS_CLICK', (ev) =>{

        // });

    },

    onTableLoad() {

    },

    initSymbols() {
        let x = this.starX;
        let y = this.starY + this.symbolSize;
        for (let i = 0; i < this.spawnCount; ++i) {
            let item = cc.instantiate(this.symbolPrefab);
            if (x < this.endX && i > 0) {
                x += this.symbolSize;
            } else {
                x = this.starX;
                y -= this.symbolSize;
            }

            item.setPosition(cc.v2(x, y));
            this.symbols.push(item);
            this.table.addChild(item, i, 'Symbol' + i);
            item.emit("SET_INDEX", i + 1);
            item.emit("SETID", this.matrix[i]);
        }
        this.isCanClick=true;
    },
    loadMatrix() {
        for (let i = 0; i < this.spawnCount; i++) {
            if (i < this.spawnCount / 2) {
                this.matrix[i] = i + 1;
            } else {
                this.matrix[i] = (i - 9);
            }
        }

    },

    symbolClick(ev) {
        ev.stopPropagation();
        const symbol = ev.getUserData();
        if(!this.isCanClick) return; 
        cc.log(this.symbolFirstIndex);
        const { id, index } = symbol;
        if (!this.isFirstClick) {
            this.symbols[index - 1].emit("HIDEN_COVER");
            this.symbolFirstID = id;
            this.symbolFirstIndex = index;
            this.isFirstClick = true;
        } else if(this.symbolFirstIndex != index){
            this.isCanClick = false;
            this.symbols[index - 1].emit("HIDEN_COVER");

            this._callback = () => {
                this.compare(id, index)
            }
            this.scheduleOnce(this._callback, 2);
             this.isFirstClick = false;

        }else{
            this.isFirstClick = true;  
        }
    },

    compare(id, index) {
        if (id == this.symbolFirstID) {
            this.symbols[index - 1].emit("HIDEN_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("HIDEN_SYMBOL");
        } else {
            this.symbols[index - 1].emit("RESET_SYMBOL");
            this.symbols[this.symbolFirstIndex - 1].emit("RESET_SYMBOL");
        }
        this.isCanClick = true;

    }


});
