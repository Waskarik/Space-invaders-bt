class Projectile {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.sprite = scene.add.rectangle(
          x,
          y,
          4,
          20,
          0x00FF00
        );
        scene.physics.add.existing(this.sprite);
        this.sprite.body.onWorldBounds = true;
        this.sprite.body.world.on('worldbounds', (body) => {
            if (body.gameObject === this.sprite) {
                this.destroy();
            }
        });
    }
    update(){
        if(this.sprite.y < -this.sprite.displayHeight){
            this.destroy();
        }

    }
    destroy() {
        this.sprite.destroy();
        this.player.projectile = null;
    }
}