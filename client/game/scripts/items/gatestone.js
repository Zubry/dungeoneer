module.exports = function(e) {
  e.on('inventory-click-item-81', (state, i) => {
    console.log(state);
    state.interfaces.inventory.remove(i);
    map.insertGatestone(state.dungeon, state.player.x, state.player.y, 81);
    state.player.place_gt(state.player.x, state.player.y);
  });
}
