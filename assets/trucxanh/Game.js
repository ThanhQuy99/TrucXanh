

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        winGamePanel: cc.Node,
        loseGamePanel: cc.Node,
        tableGame: cc.Node,
        score: 0,
        startButton: cc.Node,
    },

    onLoad() {

        //window.item = this;
        this.totalScore = this.score;
        this.tableGame.active = false;
        this.node.on("UPDATE_SCORE", this.updateScore, this);
        this.node.on("GAME_WIN", this.winGame, this);
        this.node.on("GAME_RESTART", this.restart, this);
        this.hiddenWinGamePanel();
        this.showScore();

    },
    playGame() {
        this.startButton.active = false;
        this.setNewGame();
    },

    updateScore(ev) {
        this.isUpdateScore = true;
        const isCorrect = ev.getUserData().isCorrect;
        if (isCorrect) {
            this.newScore = this.totalScore + 10;
        } else {
            this.newScore = this.totalScore - 10;
        }
        cc.tween(this)
            .to(1, { totalScore: this.newScore }, { easing: "sineInOut" })
            .call(() => {
                this.isUpdateScore = false;
            })
            .start();
        this.checkLose();
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
    hiddenWinGamePanel() {
        this.winGamePanel.active = false;
    },
    hiddenLoseGamePanel() {
        this.loseGamePanel.active = false;
    },
    setNewGame() {
        this.node.soundControl && this.node.soundControl.stopMusicAudio();
        this.totalScore = this.score;
        this.tableGame.active = true;
        this.hiddenWinGamePanel();
        this.hiddenLoseGamePanel();
        this.tableGame.emit("RESET_TABLE");
        this.showScore();
        this.node.soundControl && this.node.soundControl.playMusicAudio();
    },
    restart(ev) {
        ev.stopPropagation();
        this.totalScore = this.score;
        this.tableGame.active = true;
        // todo
        // reset table
        // reset score
        // reset effect win
        this.setNewGame();
    },
    showScore() {
        this.scoreLabel.string = 'Score: ' + Math.round(this.totalScore);
    },
    checkLose() {
        if (this.newScore == 0) {
            this.tableGame.active = false;
            this.loseGamePanel.active = true;
            this.node.soundControl && this.node.soundControl.playMusicAudio();
        }
    },
    update() {
        if (this.isUpdateScore) this.showScore();
    },

});
