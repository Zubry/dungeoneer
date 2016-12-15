const room = require('./../../resources/rooms/start-room.json');
const tileset = require('./tileset.js');
const terrain = tileset.load('tilemap', 0);
const objects = tileset.load('objectmap', 40);

module.exports = {
  'at': function(map, superx, supery) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    const i = 8 * y + x;

    const room = map.find(({room}) => room === i);

    if (!room) {
      return {
        terrain: {
          gid: 21,
          name: "emptiness",
          solid: true,
          x: 0,
          y: 1
        },
        obj: undefined
      }
    }

    const [subx, suby] = [superx % 20, (supery) % 20];
    const subi = 20 * suby + subx;

    const terrain = room.map.terrain[subi];

    if (!terrain) {
      return {
        terrain: {
          gid: 21,
          name: "emptiness",
          solid: true,
          x: 0,
          y: 1
        },
        obj: undefined
      }
    }

    terrain.gid = terrain.y * 20 + terrain.x + 1;
    const obj = room.map.objects.find((o) => o.x === subx && o.y === suby + 1);

    if (obj) {
      obj.gid = (obj.data.y) * 20 + obj.data.x + 41;
    }

    const gatestones = room.map.gatestones.find((g) => g.x === subx && g.y === suby + 1);

    return { terrain, obj, gatestones, solid: (obj && obj.data.solid) || (terrain && terrain.solid), key: room.key, doors: room.doors };
  },
  getRoomNumber: function(superx, supery) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    return 8 * y + x;
  },
  insertGatestone: function(map, superx, supery, type) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    const i = 8 * y + x;

    const [subx, suby] = [superx % 20, (supery) % 20];

    const room = map.findIndex(({room}) => room === i);
    map[room].map.gatestones.push({ x: subx, y: suby, type: type});
  },
  removeGatestone: function(map, superx, supery, type) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    const i = 8 * y + x;

    const [subx, suby] = [superx % 20, (supery) % 20];

    const room = map.findIndex(({room}) => room === i);
    const index = map[room].map.gatestones.findIndex(i => i && i.type !== type)
    map[room].map.gatestones.splice(index, 1);
  },
  removeKey: function(map, superx, supery) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    const i = 8 * y + x;

    const room = map.find(({room}) => room === i);

    if (room.key) {
      room.key = undefined;
    }
  },
  removeDoor: function(map, superx, supery, key) {
    const [ x, y ] = [Math.floor(superx / 20), Math.floor(supery / 20)]
    const i = 8 * y + x;

    const room = map.find(({room}) => room === i);

    if (room.doors) {
      room.doors = room.doors.filter((door) => door.key !== key);
    }
  }
}
