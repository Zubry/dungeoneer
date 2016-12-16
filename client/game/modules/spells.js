class Spells {
  constructor(spells) {
    this.spells = spells;
  }

  onSpellClick(spell, i) {
    alert(`clicked on ${spell}`);
  }
}

module.exports = Spells;
