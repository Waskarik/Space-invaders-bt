class Player {
  constructor(scene) {
    this.scene = scene;
    this.speed = 250;
    this.sprite = scene.physics.add.sprite(
      scene.scale.width / 2,
      scene.scale.height - 40,
      "player"
    );
    this.projectile = null;
    this.sprite.body.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }
  update() {
    this.sprite.body.setVelocity(0);
   
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.sprite.body.setVelocityX(-this.speed);
    }
    if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.sprite.body.setVelocityX(this.speed);
    }
     if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
        this.attack();
    }
    if (this.projectile) {
        this.projectile.update();
    }
    
    
 }
 attack() {
  if (!this.scene.easyMode && this.projectile)return
  this.projectile = new Projectile(this.scene,this.sprite.x,this.sprite.y - 25, this);
  this.projectile.sprite.body.setVelocityY(-650);
  this.scene.sound.play("shoot", {
  volume: 0.4,
});

  const projectile = this.projectile;
  this.scene.enemies.forEach((enemy) => {
    this.scene.physics.add.overlap(
      projectile.sprite,
      enemy.sprite,
      () => {
        projectile.destroy();
        this.scene.sound.play("EnemyDead", {
        volume: 0.4,})
        enemy.destroy();
        this.scene.score += 10;
        this.scene.scoreText.setText(`Score: ${this.scene.score}`);
        this.scene.enemies = this.scene.enemies.filter(currentEnemy => currentEnemy !== enemy);
        if(this.scene.enemies.length === 0) {
          this.scene.levelUp();
        }
      }
    );
  });
}
}
