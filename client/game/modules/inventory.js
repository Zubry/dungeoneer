class Inventory {
  constructor(items) {
    this.items = items;
  }

  add(item) {
    this.items.push(item);
  }

  batch_add(items) {
    this.items = this.items.concat(items).slice(0, 28);
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
