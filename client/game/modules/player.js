class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.orientation = 0;

    this.ht = {
      x: x,
      y: y
    };

    this.ggt = undefined;
    this.gt = undefined;

    this.health = 100;
    this.maxHealth = 100;

    this.target = undefined;
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

  face(x, y) {
    this.orientation = [Math.PI / 2, Math.PI, 0, 0, 3 * Math.PI / 2][((this.y - y) + 2 * (this.x - x) + 2)];
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

  home_teleport() {
    this.teleport(this.ht.x, this.ht.y);
  }

  get_location() {
    return {
      x: this.x,
      y: this.y
    };
  }

  damage(amount) {
    this.health -= amount;

    if (this.health < 0) {
      this.health = 0;
    }
  }

  heal(amount) {
    this.health += amount;

    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  full_heal() {
    this.health = this.maxHealth;
  }
}

module.exports = Player;
