class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("enemy1", "random_invaders_assets/saucer2a.ico");
    this.load.image("enemy2", "random_invaders_assets/saucer2b.ico");
    this.load.image("startScreen", "random_invaders_assets/start.png");
    this.load.audio("shoot","random_invaders_assets/shoot.wav");
    this.load.audio("BGM", "random_invaders_assets/music.mp3");
    this.load.audio("relaxa", "random_invaders_assets/relaxa.mp3");
    this.load.audio("EnemyDead","random_invaders_assets/invaderkilled.wav")
    this.load.image("player", "random_invaders_assets/baseshipa.ico");
    this.load.video("starfield","random_invaders_assets/field.mp4", "loadeddata",false, true);
  }
  
  create() {
    console.log("preload rodou");
    //console.log(this.cache.audio.exists("shoot"));
      this.music = this.sound.add("BGM",{
      loop: true,
      volume: 0.4,

    }) 
    this.backgroundVideo = this.add.video(
    this.scale.width / 2,
    this.scale.height / 2,
    "starfield"
    );

    this.backgroundVideo.setDisplaySize(
      this.scale.width * 0.7,
      this.scale.height * 0.7
    );
    this.backgroundVideo.setDepth(-10);
    this.backgroundVideo.setPlaybackRate(0.5);
    this.backgroundVideo.play(true);

    this.player = new Player(this);
    this.score = 0;
    this.level = 1;
    this.easyMode = false;
    this.scoreText = this.add.text(10, 10, "score: 0");
    this.levelText = this.add.text(10, 35, "level: 1");
    this.enemies = [];
    this.enemyDirection = 1;
    this.enemyProjectiles = [];
    this.enemyShootTimer = this.time.addEvent({
      delay: Math.floor(Math.random() * 2000) + 500,
      callback: () => {
        this.enemyShoot();
      },
      loop: true,
    });
    this.enemyBaseSpeed = 100;
    this.newWave();
    this.gameStarted = false;
    

    this.startScreen = this.add
    .image(
      this.scale.width / 2,
      this.scale.height / 2,
      "startScreen"
    )
    .setDisplaySize(
      this.scale.width,
      this.scale.height
    )
    .setDepth(100);


this.input.keyboard.once("keydown", () => {
  this.startScreen.destroy();
  this.gameStarted = true;
  this.physics.resume();
   if (event.code === "KeyM") {
    this.easyMode = true;
    this.music.stop();
    this.music = this.sound.add("relaxa", {
      loop: true,
      volume: 0.5,
    });
  }
  this.isGameOver = false;
  if(!this.music.isPlaying)
  this.music.play();
});
  }

  update(time, delta) {
    if(!this.gameStarted) return;
    if (this.isGameOver) return;
    if (!this.player) return;
    this.player.update();
    let hitWall = false;

    for (const enemy of this.enemies) {
      enemy.sprite.x += enemy.speed * this.enemyDirection * (delta / 1000);
      const halfWidth = enemy.sprite.displayWidth / 2;
      if (enemy.sprite.x < 0 || enemy.sprite.x > this.game.config.width) {
        hitWall = true;
      }

      if (
        enemy.sprite.x + halfWidth >= this.scale.width ||
        enemy.sprite.x - halfWidth <= 0
      ) {
        hitWall = true;
      }
    }
    if (hitWall) {
      this.enemyDirection *= -1;

      for (const enemy of this.enemies) {
        enemy.sprite.y += 30;
        enemy.speed += 10;
        console.log("Bixo ta vindo mais rapido:", enemy.speed);
      }
    }
    for (const projectile of this.enemyProjectiles) {
      if (projectile.y > this.game.config.height) {
        projectile.destroy();
        this.enemyProjectiles = this.enemyProjectiles.filter(
          (p) => p !== projectile,
        );
      }
    }
  }

  enemyShoot() {
    if(!this.gameStarted) return;
    if (this.isGameOver) return;
    if (this.enemies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.enemies.length);
    const enemy = this.enemies[randomIndex];
    const projectile = this.add.rectangle(
      enemy.sprite.x,
      enemy.sprite.y + 20,
      8,
      20,
      0xFF2D2D,
    );
    this.physics.add.existing(projectile);
    projectile.body.setVelocityY(150);
    this.enemyProjectiles.push(projectile);
    this.physics.add.overlap(projectile, this.player.sprite, () => {
      projectile.destroy();
      this.enemyProjectiles = this.enemyProjectiles.filter(
        (p) => p !== projectile,
      );
      this.gameOver();
      this.player.sprite.destroy();
      console.log("Que ruim!");
    });
  }
  
  levelUp() {
    this.level++;
    this.levelText.setText(`Level ${this.level}`);
    this.score += 1000;
    this.scoreText.setText(`Score: ${this.score}`);
    
    this.newWave();
    }
  
  newWave() {
    for(const projectile of this.enemyProjectiles){
        projectile.destroy();
    }
    this.enemyProjectiles = [];
    this.enemyBaseSpeed +=20;

    const rows = 2 + Math.floor(this.level / 2);
    const cols = 3 + Math.floor(this.level / 4  );
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const enemy = new Enemy(this, 60 + i * 60, 40 + j * 40, this.enemyBaseSpeed);
        this.enemies.push(enemy);
        this.physics.add.overlap(this.player.sprite, enemy.sprite, () => {
          this.gameOver();
        });
      }
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.music.stop();
    this.physics.pause();
    this.enemyShootTimer.remove();
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Over", {
        fontSize: "32px",
        fill: "#00FF00",
      })
      .setOrigin(0.5);
      this.add
      .text(this.scale.width / 2, this.scale.height - 40 / 2, `SCORE: ${this.score}`, {
        fontSize: "30px",
        fill: "#00FF00",
      })
      .setOrigin(0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 80,
        "Press R to Try again",
        {
          fontSize: "20px",
          fill: "#00FF00",
        },
      )
      .setOrigin(0.5);
    this.input.keyboard.once("keydown-R", () => {
      this.scene.restart();
    });
  }
}

