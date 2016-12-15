const PIXI = require('pixi.js');
const mapLoader = require('./game/map-manager/load-map.js');
const map = require('./game/map.js');
const tileset = require('./game/tileset.js');
const pathfinding = require('./game/pathfinding.js');

const gatestoneScripts = require('./game/scripts/gatestones.js');

// First, load a random map
mapLoader.load(8, (dungeon) => {
  var renderer = PIXI.autoDetectRenderer(25 * 21 + 246, 25 * 15 + 130);
  renderer.view.style.border = "1px dashed black";

  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  //Create a container object called the `stage`
  var stage = new PIXI.Container();
  stage.interactive = true;
  stage.hitArea = new PIXI.Rectangle(0, 0, 525, 375);
hey
  PIXI.loader
    .add("tileset", '../resources/warped-tileset.png')
    .add("objectset", '../resources/warped-objectset.png')
    .add("spriteset", '../resources/sprite-sheet.png')
    .add("interface", '../resources/interface.png')
    .add("magicinterface", '../resources/magicinterface.png')
    .add("minimap", '../resources/minimap.png')
    .add("minimapterrain", '../resources/minimap-tileset.png')
    .add("keys", '../resources/keys.png')
    .add("equipment", '../resources/equipment.png')
    .load(() => setup(dungeon, stage, renderer));

  //Tell the `renderer` to `render` the `stage`
  renderer.render(stage);
});

function setup(dungeon, stage, renderer) {
  // Find the starting room of the dungeon. We'll then place the player inside it
  const startRoom = dungeon.find((room) => room.name === 'start-room');
  const terrain = tileset.load('tilemap', 0, 25);
  const objects = tileset.load('objectmap', 40, 25);
  const sprites = tileset.load('spritemap', 80, 25);
  const minimapterrain = tileset.load('minimapmap', 0, 4);
  const keysprites = tileset.load('keymap', 0, 32);
  const equipmentsprites = tileset.load('equipmentmap', 0, 25);

  let path = [];

  // The start room provides its index, so we need to convert it to (x, y) coords
  // Then we place the player at (10, 11) inside the room
  let player = {};
  player.x = (startRoom.room) % 8 * 20 + 10;
  player.y = Math.floor(startRoom.room / 8) * 20 + 11;
  player.orientation = 0;

  let activeTab = 'spells';
  let inventory = [81, 82];
  let spells = [83, 84];
  let keybag = [];
  let visitedRooms = {};
  visitedRooms[startRoom.room] = true;

  renderMap();
  tick();
  setInterval(tick, 300);

  function onTileClick(x, y) {
    path = pathfinding.find(dungeon, player, {x, y});
  }

  function onItemClick(item, i) {
    gatestoneScripts.onInventoryInteraction(dungeon, inventory, player, item, i);
    renderMap();
  }

  function onSpellClick(item, i) {
    gatestoneScripts.onSpellInteraction(dungeon, inventory, player, item, i);
    renderMap();
  }

  function tick() {
    if (path.length > 0) {
      // North: 3 => 0
      // South: 1 => 180
      // East: 0 => 90
      // West: 4 => 270
      player.orientation = [Math.PI / 2, Math.PI, 0, 0, 3 * Math.PI / 2][(player.y - path[0].y) + 2 * (player.x - path[0].x) + 2];
      player.x = path[0].x;
      player.y = path[0].y;

      let tile = map.at(dungeon, player.x, player.y);
      if (tile.terrain.name === 'door-north') {
        let door = tile.doors ? tile.doors.find((door) => door.direction === 8) : false;

        if (door && !keybag.includes(door.key + 1)) {
          alert('You don\'t have the correct key!');
          player.y += 1;
          path = [];
        } else if (door && keybag.includes(door.key + 1)) {
          keybag = keybag.filter((key) => key !== door.key + 1);
          map.removeDoor(dungeon, player.x, player.y, door.key);
          player.y -= 6;
          path = [];
        } else {
          player.y -= 6;
          path = [];
        }
      } else if (tile.terrain.name === 'door-east') {
        let door = tile.doors ? tile.doors.find((door) => door.direction === -1) : false;

        if (door && !keybag.includes(door.key + 1)) {
          alert('You don\'t have the correct key!');
          player.x -= 1;
          path = [];
        } else if (door && keybag.includes(door.key + 1)) {
          keybag = keybag.filter((key) => key !== door.key + 1);
          map.removeDoor(dungeon, player.x, player.y, door.key);
          player.x += 6;
          path = [];
        } else {
          player.x += 6;
          path = [];
        }
      } else if (tile.terrain.name === 'door-south') {
        let door = tile.doors ? tile.doors.find((door) => door.direction === -8) : false;

        if (door && !keybag.includes(door.key + 1)) {
          alert('You don\'t have the correct key!');
          player.y -= 1;
          path = [];
        } else if (door && keybag.includes(door.key + 1)) {
          keybag = keybag.filter((key) => key !== door.key + 1);
          map.removeDoor(dungeon, player.x, player.y, door.key);
          player.y += 6;
          path = [];
        } else {
          player.y += 6;
          path = [];
        }
      } else if (tile.terrain.name === 'door-west') {
        let door = tile.doors ? tile.doors.find((door) => door.direction === 1) : false;

        if (door && !keybag.includes(door.key + 1)) {
          alert('You don\'t have the correct key!');
          player.x += 1;
          path = [];
        } else if (door && keybag.includes(door.key + 1)) {
          keybag = keybag.filter((key) => key !== door.key + 1);
          map.removeDoor(dungeon, player.x, player.y, door.key);
          player.x -= 6;
          path = [];
        } else {
          player.x -= 6;
          path = [];
        }
      } else if (tile.terrain.name === 'ggt-portal' && player.ggt) {
        player.x = player.ggt.x;
        player.y = player.ggt.y - 1;

        player.ggt = undefined;
        map.removeGatestone(dungeon, player.x, player.y + 1, 82);
        inventory.push(82);
        renderInterface();
        path = [];
      } else {
        path = path.slice(1);
      }
      visitedRooms[map.getRoomNumber(player.x, player.y)] = true;
      console.log(map.getRoomNumber(player.x, player.y));

      renderMap();
      renderKeybag();
    }
  }

  function renderMap() {
    stage.removeChildren();

    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 15; j++) {
        const x = i + player.x - (21 >> 1);
        const y = j + player.y - (15 >> 1);
        const tile = map.at(dungeon, x, y);

        const sprite = tileset.sprite(terrain, visitedRooms[map.getRoomNumber(x, y)] ? tile.terrain.gid : 21);

        sprite.x = i * 25;
        sprite.y = j * 25;

        sprite.interactive = true;
        sprite.on('click', (e) => onTileClick(x, y));
        stage.addChild(sprite);

        const obj = tile.obj;

        if (obj && visitedRooms[map.getRoomNumber(x, y)]) {
          const objectSprite = tileset.sprite(objects, obj.gid);
          objectSprite.x = i * 25;
          objectSprite.y = j * 25;
          stage.addChild(objectSprite);
        }

        if (tile.gatestones && visitedRooms[map.getRoomNumber(x, y)]) {
          const gatestoneSprite = tileset.sprite(sprites, tile.gatestones.type)
          gatestoneSprite.x = i * 25;
          gatestoneSprite.y = j * 25;
          stage.addChild(gatestoneSprite);
        }
      }
    }

    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 15; j++) {
        const x = i + player.x - (21 >> 1);
        const y = j + player.y - (15 >> 1);
        const tile = map.at(dungeon, x, y);

        if (tile.doors && visitedRooms[map.getRoomNumber(x, y)]) {
          // North: x % 20 = 9, y % 20 = 1
          // East: x % 20 = 18, y % 20 = 9
          // South: x % 20 = 9, y % 20 = 18
          // West: x % 20 = 1, y % 20 = 9
          // Center?: x % 20 = 10, y % 20 = 10
          tile
            .doors
            .forEach(({direction, key}) => {
              if (
                (x % 20 === 9 && y % 20 === 2 && direction === 8) ||
                (x % 20 === 17 && y % 20 === 9 && direction === -1) ||
                (x % 20 === 9 && y % 20 === 17 && direction === -8) ||
                (x % 20 === 2 && y % 20 === 9 && direction === 1)
              ) {
                const sprite = tileset.sprite(keysprites, key + 1);

                sprite.x = (i) * 25;
                sprite.y = (j) * 25;

                if (Math.abs(direction) === 1) {
                  sprite.y += 4.5;
                } else if (Math.abs(direction) === 8) {
                  sprite.x += 8.5;
                }

                stage.addChild(sprite);
              }
            })
        }

        if (tile.key && visitedRooms[map.getRoomNumber(x, y)] && x % 20 === 10 && y % 20 === 10) {
          if (player.x === x && player.y === y) {
            keybag.push(tile.key + 1);
            map.removeKey(dungeon, x, y);
          } else {
            const keySprite = tileset.sprite(keysprites, tile.key + 1);

            keySprite.x = i * 25 - 4;
            keySprite.y = j * 25 - 4;

            stage.addChild(keySprite);
          }
        }
      }
    }

    const playerGraphics = tileset.sprite(equipmentsprites, 2);
    playerGraphics.x = 10*25 + 12.5;
    playerGraphics.y = 7*25 + 12.5;
    playerGraphics.anchor.x = 0.5;
    playerGraphics.anchor.y = 0.5;
    playerGraphics.rotation = player.orientation;
    stage.addChild(playerGraphics);
    renderer.render(stage);
    renderMinimap();
    renderInterface();
    renderKeybag();
  }

  function renderKeybag() {
    keybag
      .forEach((key, i) => {
        const sprite = tileset.sprite(keysprites, key);

        sprite.x = i % 6 * 20 + 8;
        sprite.y = Math.floor(i / 6) * 20 + 8;

        sprite.height = 16;
        sprite.width = 16;
        stage.addChild(sprite);
      })
    renderer.render(stage);
  }

  function renderMinimap() {
    const minimapGraphics = new PIXI.Sprite(PIXI.utils.TextureCache['minimap']);
    minimapGraphics.x = 21*25;
    minimapGraphics.y = 0;

    for (let i = 0; i < 62; i++) {
      for (let j = 0; j < 42; j++) {
        const x = i + player.x - (62 >> 1);
        const y = j + player.y - (42 >> 1);
        const tile = map.at(dungeon, x, y);

        const sprite = tileset.sprite(minimapterrain, visitedRooms[map.getRoomNumber(x, y)] ? tile.terrain.gid : 21);

        sprite.x = i * 4 + 21*25;
        sprite.y = j * 4;

        sprite.interactive = true;
        sprite.on('click', (e) => onTileClick(x, y));
        stage.addChild(sprite);
      }
    }

    const playerGraphics = new PIXI.Graphics();
    playerGraphics.beginFill(0xFFFFFF);
    playerGraphics.drawRect(0, 0, 4, 4);
    playerGraphics.endFill();
    playerGraphics.x = 31*4 + 21*25;
    playerGraphics.y = 21*4;
    stage.addChild(playerGraphics);
    renderer.render(stage);

    stage.addChild(minimapGraphics);
    renderer.render(stage);
  }

  function renderInterface() {
    const inventoryHitBoxGraphics = new PIXI.Graphics();
    inventoryHitBoxGraphics.hitArea = new PIXI.Rectangle(525 + 105, 170, 34, 37);
    inventoryHitBoxGraphics.interactive = true;

    const spellHitBoxGraphics = new PIXI.Graphics();
    spellHitBoxGraphics.hitArea = new PIXI.Rectangle(525 + 205, 170, 34, 37);
    spellHitBoxGraphics.interactive = true;
    // stage.addChild(inventoryHitBoxGraphics);
    renderer.render(stage);

    inventoryHitBoxGraphics.on('click', () => {
      activeTab = 'inventory';
      renderInterface();
    });

    spellHitBoxGraphics.on('click', () => {
      activeTab = 'spells';
      renderInterface();
    });

    switch (activeTab) {
      case 'inventory':
        const interfaceSprite = new PIXI.Sprite(PIXI.utils.TextureCache['interface']);
        interfaceSprite.x = 525;
        interfaceSprite.y = 168;
        stage.addChild(interfaceSprite);

        // Offset (45, 50)
        inventory
          .forEach((item, i) => {
            const itemSprite = tileset.sprite(sprites, item);
            itemSprite.interactive = true;
            itemSprite.x = (i) % 4 * 40 + 50 + 25 * 21;
            itemSprite.y = Math.floor((i) / 4) * 35 + 45 + 168;
            itemSprite.on('click', (e) => onItemClick(item, i));
            stage.addChild(itemSprite);
          });
        break;
      case 'spells':
        const spellInterfaceSprite = new PIXI.Sprite(PIXI.utils.TextureCache['magicinterface']);
        spellInterfaceSprite.x = 525;
        spellInterfaceSprite.y = 168;
        stage.addChild(spellInterfaceSprite);

        spells
          .forEach((spell, i) => {
            const spellSprite = tileset.sprite(sprites, spell);
            spellSprite.interactive = true;
            spellSprite.x = (i) % 4 * 40 + 50 + 25 * 21;
            spellSprite.y = Math.floor((i) / 4) * 35 + 45 + 168;
            spellSprite.on('click', (e) => onSpellClick(spell, i));
            stage.addChild(spellSprite);
          });
        break;

    }

    stage.addChild(inventoryHitBoxGraphics);
    stage.addChild(spellHitBoxGraphics);
    renderer.render(stage);
  }
  renderer.render(stage);
}
