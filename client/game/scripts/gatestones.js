const map = require('./../map.js');

function onInventoryInteraction(dungeon, inventory, player, item, i) {
  inventory.splice(i, 1);
  map.insertGatestone(dungeon, player.x, player.y + 1, item);

  if (item === 81) {
    player.gt = { x: player.x, y: player.y + 1 };
  } else if (item === 82) {
    player.ggt = { x: player.x, y: player.y + 1 };
  }
}

function onSpellInteraction(dungeon, inventory, player, item, i) {
  if (inventory.length < 28 && (player.ggt && item === 84 || player.gt && item === 83)) {
    inventory.push(item - 2);
  }

  if (item === 83 && player.gt) {
    player.x = player.gt.x;
    player.y = player.gt.y - 1;

    player.gt = undefined;
    map.removeGatestone(dungeon, player.x, player.y + 1, item);
  } else if (item === 84 && player.ggt) {
    player.x = player.ggt.x;
    player.y = player.ggt.y - 1;

    player.ggt = undefined;
    map.removeGatestone(dungeon, player.x, player.y + 1, item);
  }
}

module.exports = {
  onInventoryInteraction,
  onSpellInteraction
}
