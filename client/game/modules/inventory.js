class Inventory {
  constructor(items) {
    this.items = items;
  }

  add(item) {
    this.items.push(item);
  }

  remove(i) {
    this.items.splice(i, 1);
  }

  empty() {
    return this.items.length === 0;
  }

  full() {
    return this.items.length >= 28;
  }

  contains(item) {
    return this.items.find((i) => i === item);
  }
}

module.exports = Inventory;
