function end(state, tile) {
  const time = new Date(Date.now() - state.stats.startTime);
  const ftime = `${Math.floor(time / 1000 / 60 / 60)}:${Math.floor(time / 1000 / 60)}:${Math.floor(time / 1000)}`;
  alert(`Congrats! You finished the dungeon in ${ftime} and died ${state.stats.deaths} times`);
}

module.exports = function(e) {
  e.on('player-on-end-portal-north', end);
  e.on('player-on-end-portal-south', end);
  e.on('player-on-end-portal-east', end);
  e.on('player-on-end-portal-west', end);
}
