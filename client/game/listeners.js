const map = require('./map.js');
const pathfinding = require('./pathfinding.js');

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
    const room = map.room(state.dungeon, state.player.x, state.player.y);
    const roomx = room.room % 8 * 20;
    const roomy = Math.floor(room.room / 8) * 20;

    if (!room.map.monsters) {
      return false;
    }

    const x = room.map.monsters
      .map(({ name, x, y, id }) => ({ name, x: x + roomx, y: y + roomy, id }))
      .map((monster) => ({ monster, path: pathfinding.find(state.dungeon, monster, state.player)}))
      .map(({monster, path}) => ({ monster, path: path.slice(0, -1)}))
      .filter(({ path }) => path.length > 0)
      .map(({monster, path}) => ({ monster, path: path[0]}))
      .filter(({path}) => !(path.x === state.player.x && path.y === state.player.y))
      .map(({monster, path}) => map.moveMonster(state.dungeon, room.room, monster.id, path.x, path.y));
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

  e.on('player-killed', (state) => {
    state.player.home_teleport();
    state.player.full_heal();
    state.stats.deaths++;
    state.player.target = undefined;
  });

  e.on('game-tick', (state) => {
    if (!state.player.target) {
      return false;
    }

    if (Math.pow(state.player.target.x - state.player.x % 20, 2) + Math.pow(state.player.target.y - state.player.y % 20, 2) <= 1) {
      state.player.face(state.player.target.x + Math.floor(state.player.x / 20) * 20, state.player.target.y + Math.floor(state.player.y / 20) * 20)
      state.player.target.health -= 5;

      if (state.player.target.health <= 0) {
        state.interfaces.inventory.batch_add(
          Array(5)
            .fill(0)
            .map(() => Math.random())
            .filter((n) => n < 0.4)
            .map((n) => n * 10)
            .map((n) => Math.ceil(n))
        );
      }
    } else {
      state.path.find(state.dungeon, state.player, { x: state.player.target.x + Math.floor(state.player.x / 20) * 20, y: state.player.target.y + Math.floor(state.player.y / 20) * 20});
    }

    if (state.player.target && state.player.target.health <= 0) {
      state.player.target = undefined;
    }
  });
}
