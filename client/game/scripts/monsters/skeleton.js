module.exports = function(e) {
  e.on('adjacent-skeleton', (monster, state) => {
    state.player.damage(1);

    if (state.player.health === 0) {
      state.events.emit('player-killed', state);
    }
  });

  e.on('attack-skeleton', (monster, state) => {
    state.player.target = monster;
  })
}
