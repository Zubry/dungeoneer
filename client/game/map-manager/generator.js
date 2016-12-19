const exec = require('child_process').exec;

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function selectRoom() {
  const list = ['ravine', 'walls', 'walls2', 'walls3', 'generic', 'generic'];
  const index = getRandomInt(list.length - 1);

  return list[index];
}

function process(data, cb) {
  const arr = data
    .split('\n')
    .map((line) => line.split(': '))
    .filter(([room, neighbors]) => neighbors)
    .filter(([room, neighbors]) => neighbors.length > 0)
    .map(([room, neighbors]) => [room, neighbors.split(', ')])
    .map(([room, neighbors]) => [parseInt(room, 10), neighbors])
    .map(([room, neighbors]) => [room, neighbors.map((i) => parseInt(i, 10))]);

  const startRoomIndex = getRandomInt(arr.length - 1);

  const result = arr
    .map(([room, neighbors], i) => ({ room, neighbors, start: i === startRoomIndex }))
    .map(({ room, neighbors, start }) => ({ room, neighbors, map: (start ? 'start-room' : selectRoom()) }))

  cb(result);
}


module.exports = {
  generate: function(size, cb) {
    exec(`elixir client/game/map-manager/generator.ex ${size}`, (err, stdout, stderr) => process(stdout, cb));
  }
}
