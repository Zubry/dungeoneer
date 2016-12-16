const Inventory = require('./inventory.js');
const Spells = require('./spells.js');

class Interfaces {
  constructor({activeTab}) {
    this.activeTab = activeTab;
    this.inventory = new Inventory([81, 82]);
    this.spells = new Spells([83, 84])
  }

  onInventorySelect() {
    this.activeTab = 'inventory';
  }

  onSpellsSelect() {
    this.activeTab = 'spells';
  }
}

module.exports = Interfaces;
