module.exports = function(e) {
  e.on('inventory-click-item-3', (state, i) => {
    state.interfaces.inventory.remove(i);
    state.player.heal(20);
  });
};
