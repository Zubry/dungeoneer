class VisitedRooms {
  constructor() {
    this.rooms = {};
  }

  visit(room) {
    this.rooms[room] = true;
  }

  unvisit(room) {
    this.rooms[room] = false;
  }

  visited(room) {
    // This gives us a true/false instead of true/undefined
    // Not that it really matters
    return this.rooms[room] === true;
  }
}

module.exports = VisitedRooms;
