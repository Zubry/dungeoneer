module.exports = function(e) {
  e.on('adjacent-zombie', (monster, state) => {
    state.player.damage(2);

    if (state.player.health === 0) {
      state.events.emit('player-killed', state);
    }
  });

  e.on('attack-zombie', (monster, state) => {
    state.player.target = monster;
  })
}
