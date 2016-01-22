Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.scale.setTo(0.4, 0.4);
    this.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this);
    this.body.drag.set(100);
    this.body.maxVelocity.set(500);
    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.currentChunk = function() {
  return new Phaser.Point(
    Math.floor(this.position.x / Chunk.WIDTH),
    Math.floor(this.position.y / Chunk.WIDTH)
  );
};
