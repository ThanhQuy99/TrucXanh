

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        winGamePanel: cc.Node,
        falseGamePanel: cc.Node,
        tableGame: cc.Node,
        score: 0,
        startButton: cc.Node,
    },

    onLoad() {

        // window.item = this;
        this.totalScore = this.score;
        this.tableGame.active = false;
        this.node.on("UPDATE_SCORE", this.updateScore, this);
        this.node.on("GAME_WIN", this.winGame, this);
        this.node.on("GAME_RESTART", this.restart, this);
        this.hiddenWinGamePannel();
        this.showScore();

    },
    playGame() {
        this.startButton.active = false;
        this.loadGame();
    },

    updateScore(ev) {
        this.isUpdateScore=true;
        const isCorrect = ev.getUserData().isCorrect;
        if(isCorrect){
            this.newScore = this.totalScore + 10;
        }else{
            this.newScore = this.totalScore - 10; 
        } 
        cc.tween(this)
            .to(1, { totalScore: this.newScore }, { easing: "sineInOut" })
            .call(() => {
                this.isUpdateScore=false;
            })
            .start();
        this.checkFalse();
        ev.stopPropagation();

    },


    winGame(ev) {
        ev.stopPropagation();
        this.showWinGamePanel();
        this.node.soundControl && this.node.soundControl.playMusicAudio();
    },
    showWinGamePanel() {
        this.tableGame.active = false;
        this.winGamePanel.active = true;

    },
    hiddenWinGamePannel() {
        this.winGamePanel.active = false;
    },
    hiddenFalseGamePannel() {
        this.falseGamePanel.active = false;
    },
    loadGame() {
        this.node.soundControl && this.node.soundControl.stopMusicAudio();
        this.totalScore = this.score;
        this.tableGame.active = true;
        this.hiddenWinGamePannel();
        this.hiddenFalseGamePannel();
        this.tableGame.emit("LOAD_TABLE");
        this.showScore();
        this.node.soundControl && this.node.soundControl.playMusicAudio();
    },
    restart(ev) {
        ev.stopPropagation();
        this.totalScore = this.score;
        this.tableGame.active = true;
        this.tableGame.emit("CLEAR_TABLE");
        this.loadGame();

    },
    showScore() {
        this.scoreLabel.string = 'Score: ' + Math.round(this.totalScore);
    },
    checkFalse() {
        if (this.newScore == 0) {
            this.tableGame.active = false;
            this.falseGamePanel.active = true;
            this.node.soundControl && this.node.soundControl.playMusicAudio();
        }
    },
    update() {
        if(this.isUpdateScore) this.showScore();
    }

});
