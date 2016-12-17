const PIXI = require('pixi.js');
const mapLoader = require('./game/map-manager/load-map.js');
const map = require('./game/map.js');

const Renderer = require('./game/modules/renderer.js');
const Options = require('./game/modules/options.js');
const SpriteLoader = require('./game/modules/sprites.js');
const GameState = require('./game/modules/state.js');

const options = new Options();

mapLoader.load(options.dungeonSize, (dungeon) => {
  const renderer = new Renderer(options);

  document.body.appendChild(renderer.renderer.view);

  const spriteLoader = new SpriteLoader(PIXI.loader);
  spriteLoader.load(() => setup(dungeon, renderer));

  renderer.render();
});

function setup(dungeon, renderer) {
  const startRoom = dungeon.find((room) => room.name === 'start-room');

  const state = new GameState({
    x: (startRoom.room) % 8 * 20 + 10,
    y: Math.floor(startRoom.room / 8) * 20 + 11,
    activeTab: 'spells',
    dungeon: dungeon
  });

  state.roomTracker.visit(startRoom.room);

  require('./game/listeners.js')(state.events);
  require('./game/scripts/terrain/')(state.events);
  require('./game/scripts/items/')(state.events);
  require('./game/scripts/spells/')(state.events);

  renderer.updateMap(state);
  renderer.updateKeyBag(state);
  renderer.updateMinimap(state);
  renderer.updateInterface(state);

  tick(state, renderer);
  setInterval(() => tick(state, renderer), 300);

  // state.events.on('interface-updated', () => renderer.updateInterface(state))
}

function tick(state, renderer) {
  renderer.updateMap(state);
  renderer.updateKeyBag(state);
  renderer.updateMinimap(state);
  renderer.updateInterface(state);

  state.events.emit('game-tick', state);
}
