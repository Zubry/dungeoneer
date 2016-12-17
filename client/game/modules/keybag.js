class KeyBag {
  constructor() {
    this.keys = [];
  }

  add(key) {
    this.keys.push(key + 1);
  }

  remove(key) {
    this.keys = this.keys.filter((k) => k !== key + 1);
  }

  contains(key) {
    return this.keys.includes(key + 1)
  }
}

module.exports = KeyBag;
