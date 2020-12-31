

cc.Class({
    extends: cc.Component,

    properties: {
        staticSymbol: cc.Node,
        lable: cc.Label,
        cover: cc.Node,
        symbols: {
            default: [],
            type: cc.SpriteFrame,
        }, 
        

    },
    

    onLoad () {
        //window.item = this;
        this.index=0;

        this.node.setIndex = this.setIndex.bind(this);
        this.node.changeToSymbol = this.changeToSymbol.bind(this);
        this.node.resetSymbol = this.resetSymbol.bind(this);
        this.node.hidenSymbol = this.hidenSymbol.bind(this);
        this.node.hidenCover = this.hidenCover.bind(this);
       // this.resetSize();
        this.node.on("SETID",this.changeToSymbol,this);
        this.node.on("SET_INDEX",this.setIndex,this);
        this.node.on("RESET_SYMBOL",this.resetSymbol,this);
        this.node.on("HIDEN_SYMBOL",this.hidenSymbol,this);
        this.node.on("HIDEN_COVER",this.hidenCover,this);
        
    },
    
    onClick(evt,index){
       // this.hidenCover();
        //this.getSymbolID();
      //  cc.error(evt, index);
     // this.node.emit("SYMBOL_HAS_CLICK",index);
      //this.node.dispatchEvent( new cc.Event.EventCustom('SYMBOL_HAS_CLICK', true) );

      this.clickItemEvent = new cc.Event.EventCustom('SYMBOL_HAS_CLICK', true);
      //let id = this.symbolID;
      this.clickItemEvent.setUserData({
              id: this.symbolID,
              index: this.index,
          });
      this.node.dispatchEvent(this.clickItemEvent);

    },




    hidenCover () {
        this.cover.active=false;
    },
    hidenSymbol() {
        this.node.active=false;
    },
    getSymbolID() {
       // cc.log(this.symbolID);
        return this.symbolID;
    },
    setIndex(num){
        this.lable.string=num;
        this.index=num;
        //cc.log('change',num);
    },
    resetSymbol(){
        //this.staticSymbol.active=true;
        this.cover.active=true;
    },
    changeToSymbol(symbolID) {
        const asset = this.symbols[symbolID];
        this.symbolID=symbolID;
        this.staticSymbol.getComponent(cc.Sprite).spriteFrame = asset;

    },

});
