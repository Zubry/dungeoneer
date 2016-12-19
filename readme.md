# Dungeoneer

Dungeoneer is a simple 2D dungeon-crawling game. Players must traverse a dungeon filled with skeletons, zombies, and forgotten warriors in as little time as possible, dying as few times as possible. Dungeoneer is based on RuneScape's dungeoneering skill.

## The Monsters

### Skeletons

![Skeletons](resources/test-drawings/skeleton.png)

Skeletons are the weakest monsters you'll encounter, dealing only one damage each turn.

### Zombies

![Zombies](resources/test-drawings/zombie.png)

Zombies are significantly stronger than skeletons and should be prioritized over them.

### Forgotten Warriors

![Forgotten Warriors](resources/test-drawings/forgotten-warrior.png)

Forgotten warriors can deal a lot of damage, so don't let more than one attack you at a time! Kill these guys first, if you want to stay alive.

## Gatestones

Two pyramids will appear in your inventory at the start of the dungeon. You can place them by clicking on them. Then, you can navigate to the spell tab and teleport to where you placed the gatestones. The spell without the dots (the first one) will teleport you to the green gatestone, and the other will teleport you to the blue gatestone.

## Food

Food will appear in your inventory after you kill a monster. Each type of food will heal between 12 and 24 hitpoints. Just click on a piece of food in your inventory to eat it.

## Endgame

To end the dungeon, just walk onto a green door. You'll know it when you see it.

## Keys

In order to progress deep into the dungeon, you must unlock doors with keys you find along the way. When you see a key on the ground, walk over it to pick it up. When you encounter a locked door, it will be unlocked automatically if you have the correct key.

## Strategy

* Remember that the dungeon is an 8x8 grid
* Try to prioritize short paths
* Use your gatestones!
* Kill forgotten warriors as quickly as possible
* Killing monsters makes the dungeon easier, but also slows you down
* Try to avoid backtracking

## Installing

I've only tested this on Ubuntu, so don't expect to get it working on another system.

To install, just clone the repo. You'll need electron-prebuilt and Elixir to be installed. You'll also probably have to NPM install as well

## Running

From the root directory of the project, just run `electron client`.

## Example Playthrough

https://www.youtube.com/watch?v=gYVhiBWFFjQ
