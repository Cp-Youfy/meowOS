import { Player } from '../classes/Player.js'
import { Terminal } from '../classes/Terminal.js'

export class DesktopBase extends Phaser.Scene {

    constructor() {
        super('DesktopBase');
    }

    preload() {
        this.load.image('background', 'assets/backgrounds/desktop.jpeg');
        this.load.spritesheet('player', 'assets/player/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    create() {
        // Create initial state
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        let folders = this.physics.add.staticGroup();


        let sampleFolder = this.add.rectangle(200, 600, 80, 80, 0x00f000, 1);
        folders.add(sampleFolder);

        let terminal = new Terminal(this)
        let player = new Player(this, 200, 300).setScale(1.5).refreshBody();

        // Define collisions
        this.physics.add.collider(player, folders)

        // Scene-wide variables
        this.player = player

    }

    update() {
        this.player.handleInput()
    }

}
