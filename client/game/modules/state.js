const Player = require('./player.js');
const Path = require('./path.js');
const Interfaces = require('./interfaces.js');
const VisitedRooms = require('./visited-rooms.js');
const KeyBag = require('./keybag.js');
const events = require('events');

class GameState {
  constructor({x, y, activeTab, dungeon}) {
    this.player = new Player(x, y);
    this.path = new Path();
    this.roomTracker = new VisitedRooms();
    this.dungeon = dungeon;
    this.keybag = new KeyBag();
    this.events = new events.EventEmitter();
    this.interfaces = new Interfaces({activeTab});
    this.stats = {
      startTime: Date.now()
    };
  }
}

module.exports = GameState;
