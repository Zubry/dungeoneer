function end(state, tile) {
  const time = new Date(Date.now() - state.stats.startTime);
  const ftime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  // alert(`Congrats! You finished the dungeon in ${ftime}`);
}

module.exports = function(e) {
  e.on('player-on-end-portal-north', end);
  e.on('player-on-end-portal-south', end);
  e.on('player-on-end-portal-east', end);
  e.on('player-on-end-portal-west', end);
}
