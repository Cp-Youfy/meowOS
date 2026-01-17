import { Player } from '../classes/Player.js'
import { Terminal } from '../classes/Terminal.js'
import { Folder } from '../classes/Folder.js'

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
        this.load.image('folder', 'assets/icons/folder.png');
    }

    create() {
        // Create initial state
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        // Initialise external objects
        let terminal = new Terminal(this);
        let player = new Player(this, 200, 300);
        this.loadFolders()

        // Define collisions
        this.physics.add.collider(player, this.folders, this.handleInteractiveCollision, null, this); // the two colliding objects are passed as params into the callback function
        this.physics.add.collider(player, terminal.background);

        // Scene-wide variables
        this.player = player;

        // Welcome message
        terminal.write("Welcome to meowOS!");

    }

    loadFolders() {
        /**
         * Position all folders manually
         */
        this.folders = this.physics.add.staticGroup();

        let folder1 = new Folder(this, 200, 400, "1");

        this.folders.add(folder1);

    }

    handleInteractiveCollision(player, interactiveObj) {
        /**
         * Sets collision status for interactiveObj execution.
         * interactiveObj can be file or folder.
         * The player must be standing on the interactiveObj.
         */

        if (player.body.touching.down && interactiveObj.body.touching.up) {
            interactiveObj.isColliding = true;
            interactiveObj.execute()
        }
    }

    update() {
        // Update prepares the canvas for the next frame each time
        this.player.handleInput()

        // Reset the state of touched folders for the next frame
        this.folders.children.entries.forEach(folder => {
            folder.isTouched = false;
        });
    }

}
