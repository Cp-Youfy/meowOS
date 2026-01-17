import { Player } from '../classes/Player.js'
import { Terminal } from '../classes/Terminal.js'
import { Folder } from '../classes/Folder.js'
import { getRandomCoords } from '../methods/randomMethods.js'

export class DesktopBase extends Phaser.Scene {

    constructor() {
        super('DesktopBase');
    }

    preload() {
        this.load.image('background', 'assets/backgrounds/desktop.png');
        this.load.spritesheet('player', 'assets/player/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
        this.load.image('folder', 'assets/icons/folder.png');
    }

    create() {
        // Create initial canvas
        this.canvasSize = {
            'width': 1280,
            'height': 720
        }

        this.background = this.add.tileSprite(640, 360, this.canvasSize.width, this.canvasSize.height, 'background');

        // Initialise external objects
        let terminal = new Terminal(this); // Height set to 0.3 * canvasHeight
        let player = new Player(this, 200, 300);
        this.loadFolders()

        // Define collisions
        this.physics.add.collider(player, this.folders, this.handleInteractiveCollision, null, this); // the two colliding objects are passed as params into the callback function
        this.physics.add.collider(player, terminal.background);

        // Scene-wide variables
        this.player = player;

        // Tab params (e.g. for explorer instances)
        this.spawnTop = 33;
        this.spawnBottom = 0.7 * this.canvasSize.height;
        this.tabSize = {
            'width': 500,
            'height': 300
        }

        // Welcome message
        terminal.write("Welcome to meowOS!");
    }

    update() {
        // Update prepares the canvas for the next frame each time
        this.player.handleInput()

        // Reset the state of touched folders for the next frame
        this.folders.children.entries.forEach(folder => {
            folder.isTouched = false;
        });
    }

    loadFolders() {
        /**
         * Position all folders manually
         */
        this.folders = this.physics.add.staticGroup();

        let folder1 = new Folder(this, 200, 400, "1");
        this.folders.add(folder1);

        let folder2 = new Folder(this, 500, 300, "2");
        this.folders.add(folder2);
    }

    handleInteractiveCollision(player, interactiveObj) {
        /**
         * Sets collision status for interactiveObj execution.
         * interactiveObj can be file or folder.
         * The player must be standing on the interactiveObj.
         * I am not chatgpt :(
         */
        if (player.body.touching.down && interactiveObj.body.touching.up) {
            interactiveObj.isColliding = true;
            let folderData = interactiveObj.execute()
            if (folderData !== null) {
                // Executed
                // Don't pause DesktopBase so that the terminal keeps running
                this.sceneTransitionExplorer(folderData)
            }
            // If null, there was no execution done.
        }
    }

    sceneTransitionExplorer(folderData) {
        // Generate necessary context for Explorer scene
        let explorerCoords = getRandomCoords(this.canvasSize, this.spawnTop, this.spawnBottom, this.tabSize);

        // Clean up necessary sprites on Desktop (Don't pause DesktopBase so that the terminal keeps running)
        this.player.disable();

        // Launch explorer
        this.scene.launch('Explorer', {
            'posData': explorerCoords,
            'folderData': folderData,
            'size': this.tabSize
        });
    }
}
