module.exports = function(e) {
  e.on('adjacent-forgotten-warrior', (monster, state) => {
    state.player.damage(3);

    if (state.player.health === 0) {
      state.events.emit('player-killed', state);
    }
  });

  e.on('attack-forgotten-warrior', (monster, state) => {
    state.player.target = monster;
  })
}
