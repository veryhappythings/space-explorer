Chunk = function(game, x, y) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.rng = new Phaser.RandomDataGenerator([this.x, this.y]);

  // Demo sprite
  //game.add.tileSprite(x, y, Chunk.WIDTH, Chunk.WIDTH, 'background');
  this.generateNoise();
  //this.populate();

  game.add.tileSprite(
    this.gamePosition().x, this.gamePosition().y,
    Chunk.WIDTH, Chunk.WIDTH,
    game.cache.getBitmapData('perlin')
  );
};

Chunk.WIDTH = 1000;

Chunk.prototype = {
  generateNoise: function() {
    var gridSize = 60;
    var distance = 50;
    var step = Chunk.WIDTH / gridSize;
    var randomGrid = new Array();
    for (var i = 0; i < gridSize + 1; i++) {
      randomGrid.push(new Array());
      for (var j = 0; j < gridSize + 1; j++) {
        randomGrid[i].push([this.rng.realInRange(-1, 1), this.rng.realInRange(-1, 1)]);
      }
    }

    bmd = game.add.bitmapData(Chunk.WIDTH, Chunk.WIDTH);
    perlin = new PerlinNoise2D(Chunk.WIDTH, randomGrid);

    for (var y = 0; y < Chunk.WIDTH; y+=distance) {
      for (var x = 0; x < Chunk.WIDTH; x+=distance) {
        var p = Math.abs(perlin.perlin(x / step, y / step));

        // Uniform noise distribution
        //var grey = Phaser.Math.clamp(255 * p, 0, 255);
        //bmd.setPixel(x, y, grey, grey, grey, false);

        // Stars
        //if (this.rng.realInRange(0, 1) > 0.9) {
          var jitterX = this.rng.integerInRange(-distance/2, distance/2);
          var jitterY = this.rng.integerInRange(-distance/2, distance/2);
          //var jitterX = 0;
          //var jitterY = 0;
          var size = this.rng.integerInRange(1, 2);
          var jx = x + jitterX;
          var jy = y + jitterY;
          var grey = Phaser.Math.clamp(255 * p, 0, 255);

          if (grey > 100) {
            for (var px = jx - (size / 2); px < jx + size; px++) {
              for (var py = jy - (size / 2); py < jy + size; py ++) {
                bmd.setPixel(px, py, grey, grey, grey, false);
              }
            }
          }
          else {
            bmd.setPixel(jx, jy, grey, grey, grey, false);
          }
        //}
      }
    }
    // Force image update
    bmd.context.putImageData(bmd.imageData, 0, 0);
    bmd.dirty = true;
    game.cache.addBitmapData('perlin', bmd);
  },

  populate: function() {
    var distance = 40;
    for (var y = 0; y < Chunk.WIDTH; y+=distance) {
      for (var x = 0; x < Chunk.WIDTH; x+=distance) {
        if (this.rng.realInRange(0, 1) > 0.995) {
          var asteroid = game.add.sprite(x + this.gamePosition().x, y + this.gamePosition().y, 'asteroid');
          asteroid.anchor.x = 0.5;
          asteroid.anchor.y = 0.5;
          game.physics.arcade.enable(asteroid);
          asteroid.body.bounce.x = 0.5;
          asteroid.body.bounce.y = 0.5;
          asteroid.body.drag.set(100);
          asteroid.rotation = this.rng.realInRange(0, 2 * Math.PI);
          asteroids.add(asteroid);
        }
      }
    };
  },

  chunkMapPosition: function() {
    return new Phaser.Point(this.x, this.y);
  },

  gamePosition: function() {
    return new Phaser.Point(this.x * Chunk.WIDTH, this.y * Chunk.WIDTH);
  },
};

Chunk.prototype.constructor = Chunk;
