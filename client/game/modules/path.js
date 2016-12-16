const pathfinding = require('./../pathfinding.js');

class Path {
  constructor() {
    this.path = [];
  }

  find(dungeon, a, b) {
    this.path = pathfinding.find(dungeon, a, b);
  }

  head() {
    return this.path[0];
  }

  shift() {
    this.path = this.path.slice(1);
  }

  clear() {
    this.path = [];
  }
}

module.exports = Path;
