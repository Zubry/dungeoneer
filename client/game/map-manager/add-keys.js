function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getRandomElement(arr) {
  const i = getRandomInt(arr.length - 1);
  return arr[i];
}

function getDeadEnds(dungeon) {
  return dungeon
    .filter((room) => room.neighbors.length === 1)
    .filter((room) => room.name !== "start-room")
}

function connected(a, b, dungeon) {
  return dungeon[a.i].includes(b.i);
}

function explore(room, direction) {
  let next = {
    i: 0
  };

  let newLocation = {};
  newLocation.i = room.i;

  if (direction === 'north') {
    newLocation.i -= 8;
    next.i = room.i - 8;
  } else if (direction === 'east') {
    newLocation.i += 1;
    next.i = room.i + 1;
  } else if (direction === 'south') {
    newLocation.i += 8;
    next.i = room.i + 8;
  } else if (direction === 'west') {
    newLocation.i -= 1;
    next.i = room.i - 1;
  }

  newLocation.path = room.path.concat([next]);

  return newLocation;
}

function findPath(start, end, dungeon) {
  const location = {
    'i': start,
    'path': [{ i: start }]
  };

  let queue = [location];
  let visited = {};

  while (queue.length > 0 && queue.length < 10000) {
    const current = queue.shift();
    visited[current.i] = true;

    let newLocation = explore(current, 'north');
    if (newLocation.i === end) {
      return newLocation.path.map(({i}) => i);
    } else if (connected(current, newLocation, dungeon) && !visited[newLocation.i]) {
      visited[newLocation.i] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'east');
    if (newLocation.i === end) {
      return newLocation.path.map(({i}) => i);
    } else if (connected(current, newLocation, dungeon) && !visited[newLocation.i]) {
      visited[newLocation.i] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'south');
    if (newLocation.i === end) {
      return newLocation.path.map(({i}) => i);
    } else if (connected(current, newLocation, dungeon) && !visited[newLocation.i]) {
      visited[newLocation.i] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'west');
    if (newLocation.i === end) {
      return newLocation.path.map(({i}) => i);
    } else if (connected(current, newLocation, dungeon) && !visited[newLocation.i]) {
      visited[newLocation.i] = true;
      queue.push(newLocation);
    }
  }

  return [];
}

function addKeys(dungeon) {
  const endRoom = getRandomElement(getDeadEnds(dungeon)).room;

  let remainingRooms = dungeon
    .filter((room) => room.neighbors.length !== 0)
    .filter((room) => room.map !== "start-room")
    .filter((room) => room.room !== endRoom)

  const roomA = getRandomElement(remainingRooms).room;

  remainingRooms = remainingRooms
    .filter((room) => room.room !== roomA);

  const roomB = getRandomElement(remainingRooms).room;

  remainingRooms = remainingRooms
    .filter((room) => room.room !== roomB);

  const startRoom = dungeon
    .find((room) => room.map === "start-room").room;

  const adjancencyMap = dungeon
    .reduce((acc, i) => {
      acc[i.room] = i.neighbors;
      return acc;
    }, {});

  const paths = [];

  paths.push(findPath(startRoom, roomB, adjancencyMap));
  paths.push(findPath(roomB, roomA, adjancencyMap));
  paths.push(findPath(roomA, endRoom, adjancencyMap));

  let path = paths
    .reduce((acc, i) => acc.concat(i), [])
    // .reduce((acc, i) => {
    //   if (!acc.contains(i)) {
    //
    //   }
    // });
  console.log(path, path.length);
  path = path
    .filter((item, pos) => path.indexOf(item) == pos)
    .map(i => ({ room: i }));

  console.log(path, path.length);

  for (let i = 0; i < (path.length >> 1); i++) {
    const keyLocation = getRandomInt(path.length - 2) + 1;
    path[keyLocation].requires = i;
  }

  let splitPaths = [[]];
  for (let i = 0; i < path.length; i++) {
    if (!path[i].hasOwnProperty('requires')) {
      splitPaths[splitPaths.length - 1].push(path[i]);
    } else {
      let r = getRandomInt(splitPaths[splitPaths.length - 1].length - 1);
      splitPaths[splitPaths.length - 1][r].key = path[i].requires;

      splitPaths.push([]);
      splitPaths[splitPaths.length - 1].push(path[i]);
    }
  }

  const pathLookup = path
    .reduce((acc, i) => {
      acc[i.room] = { room: i.room, requires: i.requires, key: i.key };
      return acc;
    }, {});


  const doors = path
    .map(room => [room, adjancencyMap[room.room]])
    .map(([room, neighbors]) => [room, neighbors.filter((n) => pathLookup[n])])
    .map(([room, neighbors], i) => [room, neighbors.filter(n => i + 1 !== path.length && n !== path[i + 1].room)])
    .map(([room, neighbors], i) => [room, neighbors.filter(n => i > 0 && n !== path[i - 1].room)])
    .map(([room, neighbors], i) => [room, neighbors.length === 0 && i > 0 ? [path[i - 1].room] : neighbors])
    .map(([room, [from]], i) => [room, from])
    .filter(([room, from]) => from)
    .filter(([room, from]) => room.hasOwnProperty('requires'))
    .map(([room, from]) => {
      return {
        from: from,
        to: room.room,
        key: room.requires
      };
    })
    .map(({ from, to, key }) => {
      return {
        from: from,
        direction: from - to,
        key: key
      };
    })
    .reduce((acc, { from, direction, key }) => {
      acc[from] = (acc[from] || []).concat([{ direction, key }]);
      return acc;
    }, {});

  const rooms = path
    .filter(room => room.key)
    .reduce((acc, { room, key }) => {
      acc[room] = key;
      return acc;
    }, {});

  const dungeonRes = dungeon
    .map(({map, neighbors, room}) => ({map, neighbors, room, key: rooms[room]}))
    .map(({map, neighbors, room, key}) => ({map, neighbors, room, key, doors: doors[room]}))
    .map(({map, neighbors, room, key, doors}) => ({map, neighbors, room, key, doors, end: room === endRoom}));

  return dungeonRes;
}

function inDungeonLevels(dungeon, room, accumulator, n) {
  for (let i = 0; i < n; i++) {
    if (accumulator[i].map((r) => r.room).includes(room.room)) {
      return true;
    }
  }

  return false;
}

function calculateDungeonLevels(dungeon, room, accumulator, n) {
  if (n > 100) {
    return accumulator;
  }

  accumulator[n] = room
    .neighbors
    .map((room) => dungeon.find((r) => r.room === room))
    .filter((room) => !inDungeonLevels(dungeon, room, accumulator, n));

  accumulator[n]
    .forEach((room) => room.depth = n);

  return accumulator[n]
    .forEach((room) => calculateDungeonLevels(dungeon, room, accumulator, n + 1));
}

function addKeysTake2(dungeon) {
  const startRoom = dungeon.find((room) => room.map === "start-room");
  let dungeonLevels = {};
  dungeonLevels[0] = [startRoom];
  calculateDungeonLevels(dungeon, startRoom, dungeonLevels, 1);

  dungeonLevels = Object.keys(dungeonLevels)
    .map((key) => dungeonLevels[key])
    .filter((elt) => elt.length !== 0);

  const keys = dungeonLevels
    .map((level) => getRandomElement(level))
    .map((room, i) => {
      room.key = i + 1;
      return room;
    });

  const doors = dungeonLevels
    .map((level) => getRandomElement(level))
    .map((room, i) => {
      room.doors = [{
        key: i + 1,
        direction: room.room - getRandomElement(room.neighbors.filter((room) => (dungeonLevels[i + 1] || []).map(room => room.room).includes(room)))
      }];

      return room;
    });

  const endRoom = getRandomElement(dungeon
    .filter((room) => room.map !== 'start-room')
    .filter((room) => room.neighbors.length === 1)
    .filter((room) => room.key === undefined)
    .filter((room) => room.depth >= 10));

  endRoom.end = true;
  return dungeon;
}

module.exports = {
  addKeys: addKeysTake2
}
