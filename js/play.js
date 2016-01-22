var playState = {
  preload: function() {
    game.load.image('background', 'img/debug-grid-1920x1920.png');
    game.load.image('ship', 'img/ship.png');
    game.load.image('asteroid', 'img/asteroid80.png');

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
    expectedChunks = {
      n: false,
      ne: false,
      e: false,
      se: false,
      s: false,
      sw: false,
      w: false,
      nw: false,
    };
    //console.log(chunks.length);
    //console.log(chunks);
    chunks.forEach(function(chunk, index, array) {
      //console.log(chunk);
      if ((chunk.x == player.currentChunk().x - 1) && (chunk.y == player.currentChunk().y - 1)) {
        expectedChunks.nw = true
      }
      if ((chunk.x == player.currentChunk().x) && (chunk.y == player.currentChunk().y - 1)) {
        expectedChunks.n = true
      }
      if ((chunk.x == player.currentChunk().x + 1) && (chunk.y == player.currentChunk().y - 1)) {
        expectedChunks.ne = true
      }
      if ((chunk.x == player.currentChunk().x + 1) && (chunk.y == player.currentChunk().y)) {
        expectedChunks.e = true
      }
      if ((chunk.x == player.currentChunk().x + 1) && (chunk.y == player.currentChunk().y + 1)) {
        expectedChunks.se = true
      }
      if ((chunk.x == player.currentChunk().x) && (chunk.y == player.currentChunk().y + 1)) {
        expectedChunks.s = true
      }
      if ((chunk.x == player.currentChunk().x - 1) && (chunk.y == player.currentChunk().y + 1)) {
        expectedChunks.sw = true
      }
      if ((chunk.x == player.currentChunk().x - 1) && (chunk.y == player.currentChunk().y)) {
        expectedChunks.w = true
      }
    });
    if (!expectedChunks.nw) {
      chunks.push(new Chunk(game, player.currentChunk().x - 1, player.currentChunk().y - 1));
    }
    else if (!expectedChunks.n) {
      chunks.push(new Chunk(game, player.currentChunk().x, player.currentChunk().y - 1));
    }
    else if (!expectedChunks.ne) {
      chunks.push(new Chunk(game, player.currentChunk().x + 1, player.currentChunk().y - 1));
    }
    else if (!expectedChunks.e) {
      chunks.push(new Chunk(game, player.currentChunk().x + 1, player.currentChunk().y));
    }
    else if (!expectedChunks.se) {
      chunks.push(new Chunk(game, player.currentChunk().x + 1, player.currentChunk().y + 1));
    }
    else if (!expectedChunks.s) {
      chunks.push(new Chunk(game, player.currentChunk().x, player.currentChunk().y + 1));
    }
    else if (!expectedChunks.sw) {
      chunks.push(new Chunk(game, player.currentChunk().x - 1, player.currentChunk().y + 1));
    }
    else if (!expectedChunks.w) {
      chunks.push(new Chunk(game, player.currentChunk().x - 1, player.currentChunk().y));
    }
  },

  render: function() {
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    //game.debug.spriteInfo(player, 32, 32);
    //game.debug.spriteInfo(asteroid, 400, 400);
  },
};
