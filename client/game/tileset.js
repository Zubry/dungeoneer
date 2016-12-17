const PIXI = require('pixi.js');

module.exports = {
  sprite: function(textures, n) {
    return new PIXI.Sprite(textures[n].texture);
  },
  load: function(file, offset, width) {
    const tiles = require(`./tilesets/${file}.json`);

    const baseTexture = PIXI.BaseTexture.fromImage(`../resources/${tiles.texture}`);

    const textures = tiles
      .textureMap
      .map(({name, x, y, solid}) => ({ rectangle: new PIXI.Rectangle(x * width, y * width, width, width), name, x, y, solid }))
      .map(({rectangle, name, x, y, solid}) => {
        const texture = new PIXI.Texture(baseTexture, rectangle);
        return { texture, name, x, y, solid};
      })
      // .map(({texture, name, x, y}) => ({ texture: new PIXI.Sprite(texture), name, x, y }))
      .reduce((acc, {texture, name, x, y, solid}) => {
        acc[y * tiles.width + x + 1 + offset] = { texture, name, x, y, solid };
        return acc;
      }, {});

    return textures;
  }
};
