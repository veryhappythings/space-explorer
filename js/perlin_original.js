PerlinNoise2D = function(textureSize, randomGrid) {
  this.randomGrid = randomGrid;
  this.gridSize = randomGrid.length;
  this.textureSize = textureSize;
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

PerlinNoise2D.prototype.perlin = function(x, y, randomGrid) {
  // find the grid co-ordinate that x and y are in
  // e.g. if the texture is 500px wide, and the grid is 50 cells wide,
  // divide each co-ordinate by 500 / 50 = 10. Therefore, (150, 150) is in
  // cell (15, 15)

  x = x / (textureSize / gridSize);
  y = y / (textureSize / gridSize);

  // Determine grid cell coordinates
  // Convert floats into ints
  var x0 = Math.floor(x);
  var y0 = Math.floor(y);

  // The bottom right of the grid cell
  var x1 = x0 + 1;
  var y1 = y0 + 1;

  // Determine interpolation weights
  var sx = x - x0;
  var sy = y - y0;

  // Top left
  var n0 = this.dotGridGradient(x, y, x0, y0);
  // Bottom left
  var n1 = this.dotGridGradient(x, y, x1, y0);
  // Left-hand side
  var ix0 = this.lerp(n0, n1, this.fade(sx));
  // Top right
  var n0 = this.dotGridGradient(x, y, x0, y1);
  // bottom right
  var n1 = this.dotGridGradient(x, y, x1, y1);
  // Right hand side
  var ix1 = this.lerp(n0, n1, this.fade(sx));

  // lerp between both sides
  return this.lerp(ix0, ix1, this.fade(sy));
}
