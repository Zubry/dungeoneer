class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.orientation = 0;

    this.ggt = undefined;
    this.gt = undefined;
  }

  teleport(x, y) {
    this.x = x;
    this.y = y;
  }

  // Shifts the player by the given amount
  shift(x, y) {
    this.x += x;
    this.y += y;
  }

  move_to(x, y) {
    this.orientation = [Math.PI / 2, Math.PI, 0, 0, 3 * Math.PI / 2][(this.y - y) + 2 * (this.x - x) + 2];
    this.x = x;
    this.y = y;
  }

  place_ggt(x, y) {
    this.ggt = {
      x: x,
      y: y
    };
  }

  place_gt(x, y) {
    this.gt = {
      x: x,
      y: y
    };
  }

  cast_ggt() {
    this.teleport(this.ggt.x, this.ggt.y);
    this.ggt = undefined;
  }

  cast_gt() {
    this.teleport(this.gt.x, this.gt.y);
    this.gt = undefined;
  }

  get_location() {
    return {
      x: this.x,
      y: this.y
    };
  }
}

module.exports = Player;
