import { Player } from '../classes/Player.js';
import { Terminal } from '../classes/Terminal.js';
import { Folder } from '../classes/Folder.js';
import { getRandomCoords } from '../methods/randomMethods.js';
import { Bomb } from '../classes/Bomb.js';


export class DesktopBase extends Phaser.Scene {

    constructor() {
        super('DesktopBase');
    }

    preload() {
        this.load.image('desktop-bg', 'assets/backgrounds/desktop.png');
        this.load.atlas('player', 'assets/player/cat.png', 'assets/player/cat.json')

        // Folder assets: Preloaded to global asset manager and reusable in all scenes
        this.load.image('fNormal', 'assets/folders/1.png');
        this.load.image('fGoop', 'assets/folders/2.png');
        this.load.image('fKira', 'assets/folders/3.png');
        this.load.image('fSpikes', 'assets/folders/4.png');

        this.load.image('bomb', 'assets/icons/bomb.png');
    }

    create() {
        // Create initial canvas
        this.canvasSize = {
            'width': 1280,
            'height': 720
        }

        // Global Data Manager
        this.registry.set('explorerStack', []) // Used to track parent explorers

        // Factor to scale player by
        let scaleFactor = 0.2
        this.folderScale = 0.15

        this.physics.world.setBounds(0, 0, this.canvasSize.width, this.canvasSize.height);

        this.background = this.add.tileSprite(640, 360, this.canvasSize.width, this.canvasSize.height, 'desktop-bg');

        // Initialise external objects
        let terminal = new Terminal(this); // Height set to 0.3 * canvasHeight
        let player = new Player(this, 200, 300, scaleFactor);
        this.loadFolders()
        this.loadBomb()

        // Define collisions
        this.physics.add.collider(player, this.folders, this.handleInteractiveCollision, null, this); // the two colliding objects are passed as params into the callback function
        this.physics.add.collider(player, this.bomb, this.handleBombCollision, null, this);
        this.physics.add.collider(player, terminal.background, this.setCollidingVelocity, null, this);

        // Scene-wide variables
        this.player = player;
        this.terminal = terminal;

        // Tab params (e.g. for explorer instances)
        this.spawnTop = 33;
        this.spawnBottom = 0.7 * this.canvasSize.height;
        this.tabSize = {
            'width': 500,
            'height': 300
        }

        // Welcome message
        this.terminal.write("Welcome to meowOS!");
    }

    update() {
        // Update prepares the canvas for the next frame each time
        this.player.handleInput()
        this.checkIllegalPlayerPos()

        // Reset the state of touched folders for the next frame
        this.folders.children.entries.forEach(folder => {
            folder.isTouched = false;
        });

        this.bomb.isColliding = false;
    }

    loadFolders() {
        /**
         * Position all folders manually
         */

        this.folders = this.physics.add.staticGroup();

        let folder1 = new Folder(this, 200, 400, "1", this.folderScale);
        this.folders.add(folder1);

        let folder2 = new Folder(this, 500, 300, "2", this.folderScale);
        this.folders.add(folder2);
    }

    loadBomb() {
        /**
         * Load bomb icon onto desktop
         */
        this.bomb = this.physics.add.staticGroup();
        let bomb = new Bomb(this, 300, 400, this.folderScale);
        this.bomb.add(bomb);
    }

    handleInteractiveCollision(player, interactiveObj) {
        /**
         * Sets collision status for interactiveObj execution.
         * interactiveObj can be file or folder.
         * The player must be standing on the interactiveObj.
         * I am not chatgpt :(
         */
        if (player.body.touching.down && interactiveObj.body.touching.up) {
            this.setCollidingVelocity()
            interactiveObj.isColliding = true;
            let folderData = interactiveObj.execute()
            if (folderData !== null) {
                // Executed
                // Don't pause DesktopBase so that the terminal keeps running
                this.sceneTransitionExplorer(folderData, interactiveObj)
            }
            // If null, there was no execution done.
        }
    }

    handleBombCollision(player, bomb) {
        /**
         * Handle collision with bomb icon and transition to BombApp scene.
         */
        if (player.body.touching.down && bomb.body.touching.up) {
            this.setCollidingVelocity();
            bomb.isColliding = true;
            let bombData = bomb.execute();
            
            if (bombData !== null) {
                this.scene.start('bombApp');
            }
        }
    }

    sceneTransitionExplorer(folderData, interactiveObj) {
        // Generate necessary context for Explorer scene
        let explorerCoords = getRandomCoords(0, this.canvasSize.width, this.spawnTop, this.spawnBottom, this.tabSize);

        // Clean up necessary sprites on Desktop (Don't pause DesktopBase so that the terminal keeps running)
        this.player.disable();

        // Add base (null) to stack to identify DesktopBase caller
        let explorerStack = this.registry.get('explorerStack');
        explorerStack.push(null)
        this.registry.set('explorerStack', explorerStack)

        // Launch explorer
        this.terminal.write("\n- Spawned new Explorer instance for directory " + folderData.name)

        this.scene.launch('Explorer', {
            'posData': explorerCoords,
            'folderData': folderData,
            'size': this.tabSize,
            'folderObj': interactiveObj // So we can reset folder state when the Explorer is closed
        });
    }

    // Tunneling protection
    setCollidingVelocity() {
        if (!this.player.hasLanded) {
            this.player.setVelocityY(-40);
            this.player.setY(this.player.y - 10)
            this.player.hasLanded = true
        }
    }

    checkIllegalPlayerPos() {
        /**
         * Additional tunneling guard that relocates the player above the terminal if it is below the allowed y-boundary
         */


        if (this.player.body.bottom > this.spawnBottom + 5) {
            this.player.y = this.spawnBottom - this.player.displayHeight;
        }
    }
}
