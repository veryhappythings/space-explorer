var BootState = function(game) {
};

BootState.prototype = {
  preload: function() {
    console.log('Boot state');
    this.game.load.image("loading","img/loading.png");
  },

  create: function() {
    this.game.state.start("preload");
  }
}
