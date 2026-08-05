class Projectile {
    constructor(scene, x, y, texture, player) {
        this.scene = scene;
        this.player = player;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setScale(0.03);
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