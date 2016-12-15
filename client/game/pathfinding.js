const map = require('./map');
const tileset = require('./tileset');

function explore(tile, direction) {
  let next = {};

  let newLocation = {
    'x': tile.x,
    'y': tile.y
  };

  if (direction === 'north') {
    newLocation.y -= 1;
    next.x = tile.x;
    next.y = tile.y - 1;
  } else if (direction === 'east') {
    newLocation.x += 1;
    next.x = tile.x + 1;
    next.y = tile.y;
  } else if (direction === 'south') {
    newLocation.y += 1;
    next.x = tile.x;
    next.y = tile.y + 1;
  } else if (direction === 'west') {
    newLocation.x -= 1;
    next.x = tile.x - 1;
    next.y = tile.y;
  }

  newLocation.path = tile.path.concat([next]);

  return newLocation;
}

function pathfinding(dungeon, start, end) {
  const location = {
    'x': start.x,
    'y': start.y,
    'path': []
  };

  let queue = [location];
  let visited = {};

  while (queue.length > 0 && queue.length < 10000) {
    const current = queue.shift();
    visited[`${current.x},${current.y}`] = true;

    let newLocation = explore(current, 'north');
    if (newLocation.x === end.x && newLocation.y === end.y) {
      return newLocation.path;
    } else if (!map.at(dungeon, newLocation.x, newLocation.y).solid && !visited[`${newLocation.x},${newLocation.y}`]) {
      visited[`${newLocation.x},${newLocation.y}`] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'east');
    if (newLocation.x === end.x && newLocation.y === end.y) {
      return newLocation.path;
    } else if (!map.at(dungeon, newLocation.x, newLocation.y).solid && !visited[`${newLocation.x},${newLocation.y}`]) {
      visited[`${newLocation.x},${newLocation.y}`] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'south');
    if (newLocation.x === end.x && newLocation.y === end.y) {
      return newLocation.path;
    } else if (!map.at(dungeon, newLocation.x, newLocation.y).solid && !visited[`${newLocation.x},${newLocation.y}`]) {
      visited[`${newLocation.x},${newLocation.y}`] = true;
      queue.push(newLocation);
    }

    newLocation = explore(current, 'west');
    if (newLocation.x === end.x && newLocation.y === end.y) {
      return newLocation.path;
    } else if (!map.at(dungeon, newLocation.x, newLocation.y).solid && !visited[`${newLocation.x},${newLocation.y}`]) {
      visited[`${newLocation.x},${newLocation.y}`] = true;
      queue.push(newLocation);
    }
  }

  return [];
}

function display(path) {
  console.log(path);
}

module.exports = {
  find: pathfinding
};
