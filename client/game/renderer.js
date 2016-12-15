const map = require('./map');
const tileset = require('./tileset');

function square({x, y, width, height}, color) {
  const square = new createjs.Shape();
  square.graphics.beginFill(color).drawRect(x, y, width, height);
  return square;
}

function scene({ x, y, width, height }) {
  let acc = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const terrain = map.at({ x: i + x - (width >> 1), y: j + y - (height >> 1)});
      const tile = renderer.square({ x: i * 25, y: j * 25, width: 25, height: 25 }, tileset.getColor(terrain));
      acc.push(tile);
    }
  }

  acc.push(renderer.square({ x: (width >> 1) * 25, y: (height >> 1) * 25, width: 25, height: 25 }, 'white'))

  return acc;
}

module.exports = {
  'square': square,
  'scene': scene
}
