module.exports = function(e) {
  e.on('spell-click-item-83', (state, i) => {
    console.log('gt');
    if (!state.interfaces.inventory.full() && !state.interfaces.inventory.contains(81)) {
      state.interfaces.inventory.add(81);
      state.player.cast_gt();
      map.removeGatestone(state.dungeon, state.player.x, state.player.y, 81);
      state.path.clear();
    }
  });
}
