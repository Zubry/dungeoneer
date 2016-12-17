module.exports = function(e) {
  e.on('spell-click-item-84', (state, i) => {
    if (!state.interfaces.inventory.full() && !state.interfaces.inventory.contains(82)) {
      state.interfaces.inventory.add(82);
      state.player.cast_ggt();
      map.removeGatestone(state.dungeon, state.player.x, state.player.y, 82);
      state.path.clear();
    }
  });
}
