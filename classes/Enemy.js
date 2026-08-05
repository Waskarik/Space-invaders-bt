class Enemy {
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = 100;
    this.sprite = scene.add.sprite(x, y, "enemy1");
    this.sprite.setScale(0.7);

    scene.physics.add.existing(this.sprite);
    this.animationTimer = scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        if (this.sprite.texture.key === "enemy1") {
          this.sprite.setTexture("enemy2");
        } else {
          this.sprite.setTexture("enemy1");
        }
      },
    });
  }
  destroy() {
  this.animationTimer.remove();
  this.sprite.destroy();


  }
}
