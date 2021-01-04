
cc.Class({
    extends: cc.Component,

    properties: {
        breakAudio: { default: null, type: cc.AudioClip },
        deathAudio: { default: null, type: cc.AudioClip },
        musicAudio: { default: null, type: cc.AudioClip },
        shotAudio: { default: null, type: cc.AudioClip },
        spawnAudio: { default: null, type: cc.AudioClip },
    },

    onLoad() {
        this.node.soundControl = this;
        this.node.on("PLAY_BREAK_AUDIO", this.playBreakAudio, this);
        this.node.on("PLAY_DEATH_AUDIO", this.playDeathAudio, this);
        this.node.on("PLAY_MUSIC_AUDIO", this.playMusicAudio, this);
        this.node.on("PLAY_SHOT_AUDIO", this.playShotAudio, this);
        this.node.on("PLAY_SPAWN_AUDIO", this.playSpawnAudio, this);

        this.node.on("STOP_MUSIC_AUDIO", this.stopMusicAudio, this);

    },
    playBreakAudio(ev) {
        ev.stopPropagation();
        cc.audioEngine.play(this.breakAudio, false, 1);
    },
    playDeathAudio(ev) {
        ev.stopPropagation();
        cc.audioEngine.play(this.deathAudio, false, 1);
    },

    playMusicAudio() {
        this.curentMusic = cc.audioEngine.play(this.musicAudio, false, 1);
    },

    playShotAudio(ev) {
        ev.stopPropagation();
        cc.audioEngine.play(this.shotAudio, false, 1);
    },

    playSpawnAudio(ev) {
        ev.stopPropagation();
        cc.audioEngine.play(this.spawnAudio, false, 1);
    },
    stopMusicAudio() {
        cc.audioEngine.stop(this.curentMusic);
    },


});
