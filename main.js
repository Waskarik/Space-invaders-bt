const config = {
  type: Phaser.AUTO,

  width: 700,
  height: 800,

  parent: "game-container",
  backgroundColor: "#241515",
  physics: {
    default: "arcade",

  arcade: {
    gravity: { y: 0, x: 0 },
    debug: false
  },
},
  scene: [GameScene],
};
const game = new Phaser.Game(config);

/*let player;
let cursors;
const PLAYER_SPEED = 250;*/