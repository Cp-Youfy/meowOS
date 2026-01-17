export class Player extends Phaser.Physics.Arcade.Sprite {
    /***
     * Defines Player class with relevant animations
     * @param {object} scene Your current scene object
     * @param {number} x Starting x-coordinate of player (from center of sprite)
     * @param {number} y Starting y-coordinate of player (from center of sprite)
     */

    constructor(scene, x, y) {
        // Setup the sprite in the scene
        super(scene, x, y, 'player', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set params for the player
        this.setScale(1.5).refreshBody();
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.createAnimations(scene);

        this.scene = scene
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    handleInput() {
        // Handle WASD
        let keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        let keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        let keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        let keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Check for inputs
        if (this.cursors.left.isDown || keyA.isDown) {
            this.setVelocityX(-160);

            this.anims.play('left', true);
        }
        else if (this.cursors.right.isDown || keyD.isDown) {
            this.setVelocityX(160);

            this.anims.play('right', true);
        }
        else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        // Only allow jumps when the player is touching a platform
        if ((this.cursors.up.isDown || keyW.isDown) && this.body.touching.down) {
            this.setVelocityY(-330);
        }
    }

    disable() {
        /**
         * Hides and disables the player, without deletion.
         * Use enable() to recover state
         */
        this.disableBody(true, true);
    }

    enable() {
        /**
         * Enables the player instance.
         */
        this.enableBody(false, 0, 0, true, true);
    }

    createAnimations(scene) {
        if (!scene.anims.exists('left')) {
            scene.anims.create({
                key: 'left',
                frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!scene.anims.exists('turn')) {
            scene.anims.create({
                key: 'turn',
                frames: [{ key: 'player', frame: 4 }],
                frameRate: 20
            });
        }

        if (!scene.anims.exists('right')) {
            scene.anims.create({
                key: 'right',
                frames: scene.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }


}