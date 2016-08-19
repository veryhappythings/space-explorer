var BreakException = {};

var PlayState = function(game) {
};

PlayState.prototype = {
  preload: function() {
    game.time.advancedTiming = true;
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0);

    asteroids = game.add.group();

    chunks = [new Chunk(game, 0, 0)];
    player = new Player(game, 400, 300);

    hudCoords = new Phaser.Text(game, 20, game.height-40, 'Coords', {fill: 'white'});
    hudCoords.fixedToCamera = true;
    game.add.existing(hudCoords);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);

    // Chunks to load around the player
    expectedChunks = [];
    var chunkDistance = 1;
    for (var x = -chunkDistance; x <= chunkDistance; x++) {
      for (var y = -chunkDistance; y <= chunkDistance; y++) {
        expectedChunks.push([x, y]);
      }
    }
  },

  update: function() {
    game.physics.arcade.collide(player, asteroids);
    game.physics.arcade.collide(asteroids, asteroids);

    if (cursors.left.isDown) {
        player.rotation -= 0.1;
    }
    else if (cursors.right.isDown) {
        player.rotation += 0.1;
    }
    if (cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(player.rotation - Math.PI/2, 200, player.body.acceleration);
    }
    else {
      player.body.acceleration.set(0);
    }

    // Infinite world
    game.world.setBounds(player.position.x - game.width, player.position.y - game.height, game.width*2, game.height*2);

    // Update HUD
    hudCoords.text = '(' + Math.floor(player.currentChunk().x) + ', ' + Math.floor(player.currentChunk().y) + ')';

    // Update chunk map
    // Load in chunks all around the player
    var neededChunks = [];
    var loadedChunks = [];
    chunks.forEach(function(chunk, index,array) {
      loadedChunks.push("" + [chunk.x, chunk.y]);
    });

    try {
      expectedChunks.forEach(function(coords, index, array) {
        var needed = [player.currentChunk().x + coords[0], player.currentChunk().y + coords[1]]
        neededChunks.push("" + needed);
        if (loadedChunks.indexOf("" + needed) == -1) {
          chunks.push(new Chunk(game, needed[0], needed[1]));
          throw BreakException;
        };
      });
    } catch(e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    // Find a better way of removing chunks?
    var forRemoval = -1;
    chunks.forEach(function(chunk, index, array) {
      if (neededChunks.indexOf("" + [chunk.x, chunk.y]) == -1) {
        forRemoval = index;
      };
    });
    if (forRemoval != -1) {
      chunks.splice(forRemoval, 1);
    };
  },

  render: function() {
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    //game.debug.spriteInfo(player, 32, 32);
    //game.debug.spriteInfo(asteroid, 400, 400);
  },
};
