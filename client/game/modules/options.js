class Options {
  constructor() {
    this.tileSize = 25;
    this.dungeonSize = 8;

    this.gameViewWidth = 21;
    this.gameViewHeight = 15;

    this.mainInterfaceWidth = 246;
    this.mainInterfaceHeight = 338;

    this.minimapWidth = 246;
    this.minimapHeight = 170;
  }

  getBoundarySize() {
    return {
      height: Math.max(this.gameViewHeight * this.tileSize, this.mainInterfaceHeight + this.minimapHeight),
      width: this.gameViewWidth * this.tileSize + this.mainInterfaceWidth
    };
  }

  getGameViewBoundarySize() {
    return {
      height: this.gameViewHeight * this.tileSize,
      width: this.gameViewWidth * this.tileSize
    };
  }
}

module.exports = Options;
