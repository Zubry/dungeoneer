module.exports = function(e) {
  e.on('inventory-click-item-4', (state, i) => {
    state.interfaces.inventory.remove(i);
    state.player.heal(24);
  });
};
