// http://mrl.nyu.edu/~perlin/noise/
PerlinNoise2D = function(textureSize, randomGrid) {
  this.randomGrid = randomGrid;
  this.gridSize = randomGrid.length;
  this.textureSize = textureSize;

  this.p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];
  for (var i=0; i < 256; i++) {
    this.p.push(this.p[i]);
  }
}

// Linearly interpolate between a0 and a1
// Weight w should be in the range [0.0, 1.0]
PerlinNoise2D.prototype.lerp = function(a0, a1, w) {
  return a0 + w * (a1 - a0);
}

// Compute the dot product of the distance and gradient vectors.
// gradient vector comes from the random grid.
PerlinNoise2D.prototype.dotGridGradient = function(x, y, ix, iy) {
  // Compute the distance vector
  var dx = x - ix;
  var dy = y - iy;
  return (dx * this.randomGrid[iy][ix][0]) + (dy * this.randomGrid[iy][ix][1]);
}

// Smooth over the transition between grids
PerlinNoise2D.prototype.fade = function(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

PerlinNoise2D.prototype.grad = function(hash, x, y) {
    switch(hash & 0x7) {
        case 0x0: return  x + y;
        case 0x1: return -x + y;
        case 0x2: return  x - y;
        case 0x3: return -x - y;
        case 0x4: return x;
        case 0x5: return -x;
        case 0x6: return  y;
        case 0x7: return -y;
        default: return 0; // never happens
    }
}

PerlinNoise2D.prototype.perlin = function(x, y, randomGrid) {
  // Find the unit cube that contains this point
  var X = Math.floor(x) & 255;
  var Y = Math.floor(y) & 255;

  // Relative position in cube
  var xf = x - Math.floor(x);
  var yf = y - Math.floor(y);

  // Fade curves for co-ords
  var u = this.fade(xf);
  var v = this.fade(yf);

  // Hash co-ordinates
  var aaa = this.p[this.p[this.p[X    ] + Y    ]];
  var aba = this.p[this.p[this.p[X    ] + Y + 1]];
  var baa = this.p[this.p[this.p[X + 1] + Y    ]];
  var bba = this.p[this.p[this.p[X + 1] + Y + 1]];

  var n0 = this.lerp(
    this.grad(aaa, xf, yf),
    this.grad(baa, xf-1, yf),
    u
  );
  var n1 = this.lerp(
    this.grad(aba, xf, yf-1),
    this.grad(bba, xf-1, yf-1),
    u
  );
  return (this.lerp(n0, n1, v) + 1) / 2;
}

