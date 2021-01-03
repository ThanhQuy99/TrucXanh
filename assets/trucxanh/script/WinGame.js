
cc.Class({
    extends: cc.Component,

    properties: {
        buttonPlay: cc.Node,

    },

    onLoad () {
        
    },
    onClick(){
        this.node.dispatchEvent(new cc.Event.EventCustom('GAME_RESTART', true));
    }


});
