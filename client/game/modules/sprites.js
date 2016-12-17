const sprites = require('./../tilesets/sprite-loader.json');

class SpriteLoader {
  constructor(loader) {
    this.loader = loader;
  }

  load(cb) {
    sprites
      .reduce((loader, {name, location}) => {
        return this.loader.add(name, location);
      })
      .load(cb);
  }
}

module.exports = SpriteLoader;
