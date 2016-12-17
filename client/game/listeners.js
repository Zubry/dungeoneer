const map = require('./map.js');

module.exports = function(e) {
  e.on('terrain-click', (params, state) => {
    console.log('click', params, state);
    state.path.find(state.dungeon, { x: state.player.x, y: state.player.y }, params);
  });

  e.on('game-tick', (state) => {
    const tile = map.at(state.dungeon, state.player.x, state.player.y);
    e.emit('player-on-tile', state, tile);
  });

  e.on('game-tick', (state) => {
    if (!state.path.empty()) {
      if (map.at(state.dungeon, state.path.head().x, state.path.head().y).solid) {
        state.path.clear();
        return false;
      }
      state.player.move_to(state.path.head().x, state.path.head().y);
      state.path.shift();
    }
  });

  e.on('player-on-tile', (state, tile) => {
    state.roomTracker.visit(map.getRoomNumber(state.player.x, state.player.y));

    if (tile.key && state.player.x % 20 === 10 && state.player.y % 20 === 10) {
      state.keybag.add(tile.key);
      map.removeKey(state.dungeon, state.player.x, state.player.y);
    }

    e.emit(`player-on-${tile.terrain.name}`, state, tile);
    state.roomTracker.visit(map.getRoomNumber(state.player.x, state.player.y));
  });

  e.on('interface-tab-click', (state, tab) => {
    state.interfaces.setTab(tab);
  });
}
