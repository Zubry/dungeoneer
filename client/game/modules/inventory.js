class Inventory {
  constructor(items) {
    this.items = items;
  }

  onItemClick(item, i) {
    alert(`clicked on ${item}`);
  }
}

module.exports = Inventory;
