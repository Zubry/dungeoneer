module.exports = function(e) {
  e.on('inventory-click-item-2', (state, i) => {
    state.interfaces.inventory.remove(i);
    state.player.heal(16);
  });
};
