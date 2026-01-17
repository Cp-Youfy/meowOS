export class Player extends Phaser.Physics.Arcade.Sprite {
    /***
     * Defines Player class with relevant animations
     * @param {object} scene Your current scene object
     * @param {number} x Starting x-coordinate of player (from center of sprite)
     * @param {number} y Starting y-coordinate of player (from center of sprite)
     */

    constructor(scene, x, y, scaleFactor) {
        // Setup the sprite in the scene
        super(scene, x, y, 'player', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set params for the player
        this.setScale(scaleFactor).refreshBody();
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(400, 600); // max x, y velocities...Hopefully stops tunneling through the terminal!

        this.createAnimations(scene);

        this.scene = scene;
        this.isJumping = false;
        this.hasLanded = true; // for preventing tunneling with terminal
        this.facing = 'left'; // current direction
        this.cursors = scene.input.keyboard.createCursorKeys();

    }

    handleInput() {
        // Handle WASD
        let keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        let keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        let keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        let keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        // Check for jumping
        let isTouchingGround = (this.body.touching.down ||
            this.body.bottom >= this.scene.physics.world.bounds.bottom);

        if (isTouchingGround) {
            this.isJumping = false;
        }

        // Check for inputs
        // Walking
        if (this.cursors.left.isDown || keyA.isDown) {
            this.facing = 'left';
            this.setVelocityX(-160);
            if (!this.isJumping) {
                this.anims.play('left-walk', true);
            } else {
                // Initial jump
                if (this.body.velocity.y < -200) {
                    this.anims.play('left-spring-up', true);
                    // Falling
                } else if (this.body.velocity.y > 0) {
                    this.anims.play('left-spring-down', true);
                    this.hasFallen = true;
                } else {
                    // Midjump
                    this.anims.play('left-air-leap', true);
                }
            }

        }
        else if (this.cursors.right.isDown || keyD.isDown) {
            this.facing = 'right'
            this.setVelocityX(160);
            if (!this.isJumping) {
                this.anims.play('right-walk', true);
            } else {
                // Initial jump
                if (this.body.velocity.y < -200) {
                    this.anims.play('right-spring-up', true)
                    // Falling
                } else if (this.body.velocity.y > 0) {
                    this.anims.play('right-spring-down', true)
                    this.hasFallen = true;
                } else {
                    // Midjump
                    this.anims.play('right-air-leap', true)
                }
            }

        }
        else {
            this.setVelocityX(0);
            if (isTouchingGround) {
                // Stationary the ground
                if (this.facing === 'left') {
                    this.anims.play('default-left');
                } else {
                    this.anims.play('default-right');
                }
            }
        }

        // Only allow jumps when the player is touching a platform
        if ((this.cursors.up.isDown || keyW.isDown) && isTouchingGround) {
            this.setVelocityY(-300);
            this.anims.play('jump', true);
            this.hasLanded = false;
            this.isJumping = true;
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
        // Default
        if (!scene.anims.exists('default-left')) {
            scene.anims.create({
                key: 'default-left',
                frames: [
                    { key: 'player', frame: 'meowassets/left-walk/walk1.png' },
                ],
                frameRate: 20
            });
        }

        if (!scene.anims.exists('default-right')) {
            scene.anims.create({
                key: 'default-right',
                frames: [
                    { key: 'player', frame: 'meowassets/right-walk/walk1.png' },
                ],
                frameRate: 20
            });
        }

        // Walking
        if (!scene.anims.exists('left-walk')) {
            scene.anims.create({
                key: 'left-walk',
                frames: [
                    { key: 'player', frame: 'meowassets/left-walk/walk1.png' },
                    { key: 'player', frame: 'meowassets/left-walk/walk2.png' }
                ],
                frameRate: 5,
                repeat: -1
            });
        }

        if (!scene.anims.exists('right-walk')) {
            scene.anims.create({
                key: 'right-walk',
                frames: [
                    { key: 'player', frame: 'meowassets/right-walk/walk1.png' },
                    { key: 'player', frame: 'meowassets/right-walk/walk2.png' }
                ],
                frameRate: 5,
                repeat: -1
            });
        }

        // Leaping
        if (!scene.anims.exists('left-leap')) {
            scene.anims.create({
                key: 'left-leap',
                frames: [
                    { key: 'player', frame: 'meowassets/left-leap/leap1.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap2.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap3.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap4.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap5.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap6.png' },
                ],
                frameRate: 10,
                repeat: -1
            });
        }

        if (!scene.anims.exists('right-leap')) {
            scene.anims.create({
                key: 'right-leap',
                frames: [
                    { key: 'player', frame: 'meowassets/right-leap/leap1.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap2.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap3.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap4.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap5.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap6.png' },
                ],
                frameRate: 10,
                repeat: -1
            });
        }

        // Jumping
        if (!scene.anims.exists('jump')) {
            scene.anims.create({
                key: 'jump',
                frames: [
                    { key: 'player', frame: 'meowassets/jump/jump2.png' },
                ],
                frameRate: 10,
                repeat: -1
            });
        }

        // Jump-Spring
        if (!scene.anims.exists('left-spring-up')) {
            scene.anims.create({
                key: 'left-spring-up',
                frames: [
                    { key: 'player', frame: 'meowassets/left-leap/leap1.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap2.png' },
                    { key: 'player', frame: 'meowassets/left-leap/leap3.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('left-air-leap')) {
            scene.anims.create({
                key: 'left-air-leap',
                frames: [
                    { key: 'player', frame: 'meowassets/left-leap/leap4.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('left-spring-down')) {
            scene.anims.create({
                key: 'left-spring-down',
                frames: [
                    { key: 'player', frame: 'meowassets/left-leap/leap5.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('right-spring-up')) {
            scene.anims.create({
                key: 'right-spring-up',
                frames: [
                    { key: 'player', frame: 'meowassets/right-leap/leap1.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap2.png' },
                    { key: 'player', frame: 'meowassets/right-leap/leap3.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('right-air-leap')) {
            scene.anims.create({
                key: 'right-air-leap',
                frames: [
                    { key: 'player', frame: 'meowassets/right-leap/leap4.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('right-spring-down')) {
            scene.anims.create({
                key: 'right-spring-down',
                frames: [
                    { key: 'player', frame: 'meowassets/right-leap/leap5.png' },
                ],
                frameRate: 10,
                repeat: 0
            });
        }
    }



}