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

  create2DRange(width, height) {
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

    terrain.interactive = true;
    terrain.on('mousedown', (e) => state.events.emit('terrain-click', {x, y}, state));

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
    // const playerFrames = new PIXI.extras.AnimatedSprite([this.tilesets.equipmentsprites[3].texture, this.tilesets.equipmentsprites[4].texture]);
    playerGraphics.x = 10 * options.tileSize + 12.5;
    playerGraphics.y = 7 * options.tileSize + 12.5;
    playerGraphics.anchor.x = 0.5;
    playerGraphics.anchor.y = 0.5;
    playerGraphics.rotation = state.player.orientation;
    // playerGraphics.animationSpeed = 1;
    // playerFrames.play();

    this.stage.addChild(playerGraphics);
    // this.foo = setInterval(() => this.render(), 300);
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

  updateKeyBag(state) {
    state.keybag.keys
      .forEach((key, i) => {
        const sprite = tileset.sprite(this.tilesets.keysprites, key);

        sprite.x = i % 6 * 20 + 8;
        sprite.y = Math.floor(i / 6) * 20 + 8;

        sprite.height = 16;
        sprite.width = 16;
        this.stage.addChild(sprite);
      });

    this.render();
  }

  updateMinimap(state) {
    const minimapGraphics = new PIXI.Sprite(PIXI.utils.TextureCache['minimap']);
    minimapGraphics.x = 21*25;
    minimapGraphics.y = 0;

    this
      .create2DRange(62, 42)
      .map(({i, j}) => ({i, j, x: i + state.player.x - (62 >> 1), y: j + state.player.y - (42 >> 1)}))
      .map(({i, j, x, y}) => ({i, j, x, y, tile: map.at(state.dungeon, x, y)}))
      .map(({i, j, x, y, tile}) => ({i, j, x, y, tile, visited: state.roomTracker.visited(map.getRoomNumber(x, y))}))
      .forEach(({i, j, x, y, tile, visited}) => {
        const sprite = tileset.sprite(this.tilesets.minimapterrain, visited ? tile.terrain.gid : 21);

        sprite.x = i * 4 + 21 * 25;
        sprite.y = j * 4;

        sprite.interactive = true;
        sprite.on('mousedown', (e) => state.events.emit('terrain-click', {x, y}, state));

        this.stage.addChild(sprite);
      });

    const playerGraphics = new PIXI.Graphics();
    playerGraphics.beginFill(0xFFFFFF);
    playerGraphics.drawRect(0, 0, 4, 4);
    playerGraphics.endFill();
    playerGraphics.x = 31*4 + 21*25;
    playerGraphics.y = 21*4;
    this.stage.addChild(playerGraphics);

    this.stage.addChild(minimapGraphics);
    this.render();
  }

  updateInterface(state) {
    const inventoryHitBoxGraphics = new PIXI.Graphics();
    inventoryHitBoxGraphics.hitArea = new PIXI.Rectangle(525 + 105, 170, 34, 37);
    inventoryHitBoxGraphics.interactive = true;

    const spellHitBoxGraphics = new PIXI.Graphics();
    spellHitBoxGraphics.hitArea = new PIXI.Rectangle(525 + 205, 170, 34, 37);
    spellHitBoxGraphics.interactive = true;

    inventoryHitBoxGraphics.on('mousedown', () => {
      state.events.emit('interface-tab-click', state, 'inventory');
      this.updateInterface(state);
    });

    spellHitBoxGraphics.on('mousedown', () => {
      state.events.emit('interface-tab-click', state, 'spells');
      this.updateInterface(state);
    });

    switch (state.interfaces.activeTab) {
      case 'inventory':
        const interfaceSprite = new PIXI.Sprite(PIXI.utils.TextureCache['interface']);
        interfaceSprite.x = 525;
        interfaceSprite.y = 168;
        this.stage.addChild(interfaceSprite);

        // Offset (45, 50)
        state.interfaces.inventory.items
          .forEach((item, i) => {
            const itemSprite = tileset.sprite(this.tilesets.sprites, item);
            itemSprite.interactive = true;
            itemSprite.x = (i) % 4 * 40 + 50 + 25 * 21;
            itemSprite.y = Math.floor((i) / 4) * 35 + 45 + 168;
            itemSprite.on('mousedown', (e) => state.events.emit(`inventory-click-item-${item}`, state, i));
            this.stage.addChild(itemSprite);
          });
        break;
      case 'spells':
        const spellInterfaceSprite = new PIXI.Sprite(PIXI.utils.TextureCache['magicinterface']);
        spellInterfaceSprite.x = 525;
        spellInterfaceSprite.y = 168;
        this.stage.addChild(spellInterfaceSprite);

        state.interfaces.spells.spells
          .forEach((spell, i) => {
            const spellSprite = tileset.sprite(this.tilesets.sprites, spell);
            spellSprite.interactive = true;
            spellSprite.x = (i) % 4 * 40 + 50 + 25 * 21;
            spellSprite.y = Math.floor((i) / 4) * 35 + 45 + 168;
            this.stage.addChild(spellSprite);
            spellSprite.on('mousedown', (e) => state.events.emit(`spell-click-item-${spell}`, state, i));
          });
        break;

    }

    this.stage.addChild(inventoryHitBoxGraphics);
    this.stage.addChild(spellHitBoxGraphics);

    this.render();
  }
}

module.exports = Renderer;
