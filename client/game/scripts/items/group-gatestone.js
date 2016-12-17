module.exports = function(e) {
  e.on('inventory-click-item-82', (state, i) => {
    console.log(state);
    state.interfaces.inventory.remove(i);
    map.insertGatestone(state.dungeon, state.player.x, state.player.y, 82);
    state.player.place_ggt(state.player.x, state.player.y);
  });
}
