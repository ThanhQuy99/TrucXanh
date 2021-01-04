

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

        window.item = this;
        this.totalScore = this.score;
        this.tableGame.active = false;
        this.node.on("ADD_SCORE", this.addScore, this);
        this.node.on("REMOVE_SCORE", this.removeScore, this);
        this.node.on("GAME_WIN", this.winGame, this);
        this.node.on("GAME_RESTART", this.restart, this);
        this.hiddenWinGamePannel();
        this.showScore();

    },
    playGame() {
        this.startButton.active = false;
        this.loadGame();
    },

    addScore(ev) {
        ev.stopPropagation();
        this.totalScore += 10;
        this.showScore();
        //cc.log(this.score);
    },
    removeScore(ev) {
        ev.stopPropagation();
        this.totalScore -= 10;
        this.showScore();
        this.checkFalse();
        //cc.log(this.score);
    },
    winGame(ev) {
        ev.stopPropagation();
        this.showWinGamePanel();
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
        this.totalScore = this.score;
        this.tableGame.active = true;
        this.hiddenWinGamePannel();
        this.hiddenFalseGamePannel();
        this.tableGame.emit("LOAD_TABLE");
        this.showScore();
    },
    restart(ev) {
        ev.stopPropagation();
        // cc.log(this.score);
        this.totalScore = this.score;
        this.tableGame.active = true;
        this.tableGame.emit("CLEAR_TABLE");
        this.loadGame();

    },
    showScore() {
        this.scoreLabel.string = 'Score: ' + this.totalScore;
    },
    checkFalse() {
        if (this.totalScore == 0) {
            //cc.log('false');
            this.tableGame.active = false;
            this.falseGamePanel.active = true;
        }
    },

});
