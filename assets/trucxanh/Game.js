

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        winGamePanel: cc.Node,
        tableGame: cc.Node,
    },

    onLoad() {
       window.item = this;
        this.score = 0;
        this.node.on("ADD_SCORE", this.addScore, this);
        this.node.on("GAME_WIN", this.winGame, this);
        this.node.on("GAME_RESTART", this.restart, this);
        this.hiddenWinGamePannel();
        
    },

    addScore(ev) {
        ev.stopPropagation();
        this.score +=1;
        this.scoreLabel.string = 'Score: '+this.score;
    },

    winGame(ev){
        ev.stopPropagation();
        this.showWinGamePanel();
    },
    showWinGamePanel(){
        
        this.winGamePanel.active=true;
    },
    hiddenWinGamePannel(){
        this.winGamePanel.active=false;
    },
    loadGame(){
        this.hiddenWinGamePannel();
        this.tableGame.emit("LOAD_TABLE");
    },
    restart(ev){
        ev.stopPropagation();
        this.tableGame.emit("CLEAR_TABLE");
        this.loadGame();
        
    },

});
