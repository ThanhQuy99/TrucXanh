

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
        this.node.setLabel = this.setLabel.bind(this);
        this.node.changeToSymbol = this.changeToSymbol.bind(this);
        this.node.checkAccept = this.checkAccept.bind(this);
       // this.resetSize();
        this.node.on("SETID",this.changeToSymbol,this);
        this.node.on("SET_LABLE_COVER",this.setLabel,this);
        this.node.on("CHECK_ACCEPT",this.checkAccept,this);
    },
    
    onClick(evt,index){
        this.hidenCover();
        this.getSymbolID();
      //  cc.error(evt, index);
     // this.node.emit("SYMBOL_HAS_CLICK",index);
      //this.node.dispatchEvent( new cc.Event.EventCustom('SYMBOL_HAS_CLICK', true) );

      this.clickItemEvent = new cc.Event.EventCustom('SYMBOL_HAS_CLICK', true);
      let id = this.symbolID;
      this.clickItemEvent.setUserData({
              id: this.symbolID,
          });
      this.node.dispatchEvent(this.clickItemEvent);

    },

    hidenCover () {
        this.cover.active=false;
    },
    hidenSymbol() {
        this.staticSymbol.active=false;
    },
    getSymbolID() {
       // cc.log(this.symbolID);
        return this.symbolID;
    },
    setLabel(num){
        this.lable.string=num;
        //cc.log('change',num);
    },
    resetPrefab(){
        this.staticSymbol.active=true;
        this.cover.active=true;
    },
    changeToSymbol(symbolID) {
        const asset = this.symbols[symbolID];
        this.symbolID=symbolID;
        this.staticSymbol.getComponent(cc.Sprite).spriteFrame = asset;

    },
    checkAccept(id){
        if(this.symbolID==id){
            this.hidenSymbol();
        }else{
            this.resetPrefab();
        }
    },

  

});
