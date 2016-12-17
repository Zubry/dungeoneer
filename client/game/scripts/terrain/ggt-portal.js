module.exports = function(e) {
  e.on('player-on-ggt-portal', (state, tile) => {
    if (!state.player.ggt) {
      return false;
    }

    state.player.cast_ggt()
    map.removeGatestone(state.dungeon, state.player.x, state.player.y, 82);
    state.interfaces.inventory.add(82);
    state.path.clear();
  });
}
