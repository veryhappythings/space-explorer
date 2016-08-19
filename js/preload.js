var PreloadState = function(game) {
};

PreloadState.prototype = {
  preload: function() {
    console.log('Preload state');
    var loadingBar = this.add.sprite(160,240,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);

    game.load.image('background', 'img/debug-grid-1920x1920.png');
    game.load.image('ship', 'img/ship.png');
    game.load.image('asteroid', 'img/asteroid80.png');
  },

  create: function() {
    this.game.state.start("play");
  }
}
