LargeStar = function(game) {
    Phaser.Sprite.call(this, game, 0, 0, 'large_star');

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;
};

LargeStar.prototype.constructor = LargeStar;
