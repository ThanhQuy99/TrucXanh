

cc.Class({
    extends: cc.Component,

    properties: {
        staticSymbol: cc.Node,
        label: cc.Label,
        cover: cc.Node,
        symbols: {
            default: [],
            type: cc.SpriteFrame,
        },


    },


    onLoad() {
        this.index = 0;

        this.node.on("SET_ID", this.changeToSymbol, this);
        this.node.on("SET_INDEX", this.setIndex, this);
        this.node.on("RESET_SYMBOL", this.resetSymbol, this);
        this.node.on("HIDDEN_SYMBOL", this.hiddenSymbol, this);
        this.node.on("DISABLED_SYMBOL", this.disabledSymbol, this);
        this.node.on("ENABLED_SYMBOL", this.enabledSymbol, this);
        this.node.on("HIDDEN_COVER", this.flipShow, this);
        this.node.on("RESET_COVER", this.flipHide, this);
        this.node.on("SHOW_COVER", this.showCover, this);

    },

    onClick(evt, index) {
        this.clickItemEvent = new cc.Event.EventCustom('SYMBOL_HAS_CLICK', true);
        this.clickItemEvent.setUserData({
            id: this.symbolID,
            index: this.index,
        });
        this.node.dispatchEvent(this.clickItemEvent);

    },


    flipShow() {
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0, 1),
            cc.callFunc(() => {
                this.cover.active = false;
            }),
            cc.scaleTo(0.2, 1, 1)
        ));

    },


    flipHide() {
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0, 1),
            cc.callFunc(() => {
                this.cover.active = true;
            }),
            cc.scaleTo(0.2, 1, 1)
        ));
    },
    showCover() {
        this.cover.active = true;
    },
    hiddenSymbol() {
        this.node.opacity = 0;
    },

    disabledSymbol() {
        this.node.active = false;
    },
    enabledSymbol() {
        this.node.active = true;
    },

    getSymbolID() {
        return this.symbolID;
    },
    setIndex(num) {
        this.label.string = num;
        this.index = num;
    },
    resetSymbol(i) {
        const delay = i * 0.1;
        this.node.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.fadeIn(0.1)
        ));

    },
    changeToSymbol(symbolID) {
        const asset = this.symbols[symbolID];
        this.symbolID = symbolID;
        this.staticSymbol.getComponent(cc.Sprite).spriteFrame = asset;

    },

});
