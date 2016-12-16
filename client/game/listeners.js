module.exports = function(e) {
  e.on('terrain-click', (e, params, state) => {
    console.log(state);
    state.path.find(state.dungeon, { x: state.player.x, y: state.player.y }, params)
    console.log(state);
  });
}
