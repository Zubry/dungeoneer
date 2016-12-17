const generator = require('./generator.js');
const keys = require('./add-keys.js');
const terrain = require('./../tilesets/tilemap.json');
const objects = require('./../tilesets/objectmap.json');

const rooms = {
  'generic': require('./../../../resources/rooms/generic.json'),
  'ravine': require('./../../../resources/rooms/ravine.json'),
  'start-room': require('./../../../resources/rooms/start-room.json'),
  'walls': require('./../../../resources/rooms/walls.json'),
  'walls2': require('./../../../resources/rooms/walls2.json')
}

let endpointSelected = false;

function addEndpoint(size, { height, terrain: ter, objects, gatestones }, room, neighbors, name, end) {
  if (!end) {
    return { height, terrain: ter, objects, gatestones };
  }

  const [north, east, south, west] = [
    room - size,
    room + 1,
    room + size,
    room - 1
  ];

  let terrainBuffer = ter.slice();

  if (neighbors.includes(north)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 6 ? 11 : subtile);
  }

  if (neighbors.includes(east)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 5 ? 10 : subtile);
  }

  if (neighbors.includes(south)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 2 ? 8 : subtile);
  }

  if (neighbors.includes(west)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 3 ? 9 : subtile);
  }

  return { height, terrain: terrainBuffer, objects, gatestones };
}

function updateDoors(size, { height, terrain: ter, objects: o, gatestones }, room, neighbors, name) {
  const [north, east, south, west] = [
    room - size,
    room + 1,
    room + size,
    room - 1
  ];

  let terrainBuffer = ter.slice();

  if (!neighbors.includes(north)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 2 ? 23 : subtile);
  }

  if (!neighbors.includes(east)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 3 ? 22 : subtile);
  }

  if (!neighbors.includes(south)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 6 ? 26 : subtile);
  }

  if (!neighbors.includes(west)) {
    terrainBuffer = terrainBuffer
      .map(subtile => subtile === 5 ? 25 : subtile);
  }

  return { height, terrain: terrainBuffer, objects: o, gatestones };
}

function processTerrain({ height, terrain: ter, objects: obj, gatestones }) {
  t = ter
    .map((i) => ({ x: (i - 1) % 20, y: Math.floor((i - 1) / 20), i: i }))
    .map(({x, y}) => terrain.textureMap.find((tile) => tile.x === x && tile.y === y))

  return { height, terrain: t, objects: obj, gatestones };
}

function processObjects({ height, terrain: ter, objects: obj, gatestones }) {
  o = obj
    .map((i) => ({ x: i.x / 25, y: i.y / 25, gid: i.gid - 1}))
    .map(({x, y, gid}) => ({ x, y, gid: gid - 40}))
    .map(({x, y, gid}) => ({ x, y, gidx: gid % 20, gidy: Math.floor(gid / 20) }))
    .map(({x, y, gidx, gidy}) => ({ data: objects.textureMap.find((tile) => tile.x === gidx && tile.y === gidy), x, y}))

  return { height, terrain: ter, objects: o, gatestones };
}

function process(size, data, callback) {
  const arr = keys.addKeys(data)
    .map(({map, neighbors, room, key, doors, end}) => ({ neighbors, room, key, doors, end, map: rooms[map], name: map }))
    .map(({map, neighbors, room, key, doors, end, name}) => ({ neighbors, room, key, doors, end, name, map: { height: map.height, terrain: map.layers[0].data, objects: map.layers[1].objects, gatestones: map.layers[2].objects.slice() } }))
    .map(({map, neighbors, room, key, doors, end, name}) => ({neighbors, room, key, doors, end, name, map: addEndpoint(size, map, room, neighbors, name, end)}))
    .map(({map, neighbors, room, key, doors, end, name}) => ({neighbors, room, key, doors, end, name, map: updateDoors(size, map, room, neighbors, name)}))
    .map(({map, neighbors, room, key, doors, end, name}) => ({neighbors, room, key, doors, end, name, map: processTerrain(map)}))
    .map(({map, neighbors, room, key, doors, end, name}) => ({neighbors, room, key, doors, end, name, map: processObjects(map)}));

  callback(arr);
}

module.exports = {
  load: function(size, callback) {
    generator.generate(size, (data) => process(size, data, callback));
  }
}
