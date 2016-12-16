const PIXI = require('pixi.js');
const tileset = require('./../tileset.js');
const map = require('./../map.js');

class Renderer {
  constructor(options) {
    const boundarySize = options.getBoundarySize();
    const gameViewBoundarySize = options.getGameViewBoundarySize();

    this.options = options;
    this.renderer = PIXI.autoDetectRenderer(boundarySize.width, boundarySize.height);

    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.stage.hitArea = new PIXI.Rectangle(0, 0, gameViewBoundarySize.width, gameViewBoundarySize.height);

    this.tilesets = {};

    this.tilesets.terrain = tileset.load('tilemap', 0, 25);
    this.tilesets.objects = tileset.load('objectmap', 40, 25);
    this.tilesets.sprites = tileset.load('spritemap', 80, 25);
    this.tilesets.minimapterrain = tileset.load('minimapmap', 0, 4);
    this.tilesets.keysprites = tileset.load('keymap', 0, 32);
    this.tilesets.equipmentsprites = tileset.load('equipmentmap', 0, 25);
  }

  render() {
    this.renderer.render(this.stage);
  }

  create2DRange(width, height, x, y) {
    return Array(height)
      .fill(0)
      .map((_, i) => i)
      .map((i) => ({ y: i, x: Array(width).fill(0)}))
      .map(({x, y}) => ({ y, x: x.map((_, i) => i) }))
      .map(({x, y}) => ({ i: x, j: y }))
      .map(({i, j}) => i.map(x => ({ i: x, j: j})))
      .reduce((acc, i) => acc.concat(i));
  }

  renderTerrain(state, { i, j, x, y, tile, visited }) {
    const terrain = tileset.sprite(this.tilesets.terrain, visited ? tile.terrain.gid : 21);

    terrain.x = i * this.options.tileSize;
    terrain.y = j * this.options.tileSize;
    terrain.on('click', (e) => state.events.emit('terrain-click', e, { x, y }, state));
    terrain.interactive = true;
    this.stage.addChild(terrain);

    return { i, j, x, y, tile, visited };
  }

  renderObjects(state, { i, j, x, y, tile, visited }) {
    const objectSprite = tileset.sprite(this.tilesets.objects, tile.obj.gid);
    objectSprite.x = i * this.options.tileSize;
    objectSprite.y = j * this.options.tileSize;
    this.stage.addChild(objectSprite);

    return { i, j, x, y, tile, visited };
  }

  renderGatestones(state, { i, j, x, y, tile, visited }) {
    const gatestoneSprite = tileset.sprite(this.tilesets.sprites, tile.gatestones.type);
    gatestoneSprite.x = i * this.options.tileSize;
    gatestoneSprite.y = j * this.options.tileSize;
    this.stage.addChild(gatestoneSprite);

    return { i, j, x, y, tile, visited };
  }

  renderKeyDoors(state, { i, j, x, y, tile, visited }) {
    tile.doors
      .forEach(({direction, key}) => {
        if (
          (x % 20 === 9 && y % 20 === 2 && direction === 8) ||
          (x % 20 === 17 && y % 20 === 9 && direction === -1) ||
          (x % 20 === 9 && y % 20 === 17 && direction === -8) ||
          (x % 20 === 2 && y % 20 === 9 && direction === 1)
        ) {
          const sprite = tileset.sprite(this.tilesets.keysprites, key + 1);

          sprite.x = (i) * this.options.tileSize;
          sprite.y = (j) * this.options.tileSize;

          sprite.width = 25;
          sprite.height = 25;

          if (Math.abs(direction) === 1) {
            sprite.y += 12.5;
          } else if (Math.abs(direction) === 8) {
            sprite.x += 12.5;
          }

          this.stage.addChild(sprite);
        }

      return { i, j, x, y, tile, visited };
    });
  }

  renderKeys(state, { i, j, x, y, tile, visited }) {
    const keySprite = tileset.sprite(this.tilesets.keysprites, tile.key + 1);

    keySprite.x = i * this.options.tileSize;
    keySprite.y = j * this.options.tileSize;

    keySprite.width = 25;
    keySprite.height = 25;

    this.stage.addChild(keySprite);

    return { i, j, x, y, tile, visited };
  }

  renderPlayer(state) {
    const playerGraphics = tileset.sprite(this.tilesets.equipmentsprites, 2);
    playerGraphics.x = 10 * options.tileSize + 12.5;
    playerGraphics.y = 7 * options.tileSize + 12.5;
    playerGraphics.anchor.x = 0.5;
    playerGraphics.anchor.y = 0.5;
    playerGraphics.rotation = state.player.orientation;
    this.stage.addChild(playerGraphics);
  }

  updateMap(state) {
    this.stage.removeChildren();

    const range = this
      .create2DRange(this.options.gameViewWidth, this.options.gameViewHeight)
      .map(({ i, j }) => ({ i, j, x: i + state.player.x - (options.gameViewWidth >> 1), y: j + state.player.y - (options.gameViewHeight >> 1)}))
      .map(({ i, j, x, y}) => ({ i, j, x, y, tile: map.at(state.dungeon, x, y)}))
      .map(({ i, j, x, y, tile }) => ({ i, j, x, y, tile, visited: state.roomTracker.visited(map.getRoomNumber(x, y))}));

    // First, we render the terrain layer
    range
      .forEach(this.renderTerrain.bind(this, state));

    // Then, we render the object layer, but only for visited tiles with an object
    range
      .filter(({ tile }) => tile.obj)
      .filter(({ visited }) => visited)
      .forEach(this.renderObjects.bind(this, state))

    // We treat gatestones the same as objects, just on another layer
    range
      .filter(({ tile }) => tile.gatestones)
      .filter(({ visited }) => visited)
      .forEach(this.renderGatestones.bind(this, state))

    // Next up are key doors
    range
      .filter(({ tile }) => tile.doors)
      .filter(({ visited }) => visited)
      .forEach(this.renderKeyDoors.bind(this, state))

    // Then, keys
    range
      .filter(({ tile }) => tile.key)
      .filter(({ visited }) => visited)
      .filter(({ x }) => x % 20 === 10)
      .filter(({ y }) => y % 20 === 10)
      .forEach(this.renderKeys.bind(this, state))

    this.renderPlayer(state);

    this.render();
  }
}

module.exports = Renderer;
