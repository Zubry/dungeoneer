module.exports = function(e) {
  e.on('player-on-door-south', (state, tile) => {
    let door = tile.doors ? tile.doors.find((door) => door.direction === -8) : false;

    if (door && !state.keybag.contains(door.key)) {
      alert('You don\'t have the correct key!');
      state.player.shift(0, -1);
      state.path.clear();
    } else if (door && state.keybag.contains(door.key)) {
      map.removeDoor(state.dungeon, state.player.x, state.player.y, door.key);
      state.keybag.remove(door.key);
      state.player.shift(0, 6);
      state.path.clear();
    } else {
      state.player.shift(0, 6);
      state.path.clear();
    }
  });
}
