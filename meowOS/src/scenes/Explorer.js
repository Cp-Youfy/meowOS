import { Player } from '../classes/Player.js';
import { Folder } from '../classes/Folder.js';
import { ExplorerBar } from '../classes/ExplorerBar.js'
import { getRandomCoords } from '../methods/randomMethods.js';

export class Explorer extends Phaser.Scene {
    /***
     * Defines Explorer class, an interactive UI element that can be populated with files / directories that recursively spawn their own relevant Explorer windows.
     * @param {string} id ID of the folder being opened
     */

    // Spawn the Explorer window in a random location within the screen boundaries
    constructor() {
        super('Explorer');
    }

    init(context) {
        // Retrieve context
        this.context = context;
        this.x = context.posData.x;
        this.y = context.posData.y;
        this.folderData = context.folderData;
        this.size = context.size;
        this.folderObj = context.folderObj;
    }

    preload() {
        this.load.image('explorer-bg', 'assets/backgrounds/explorer.png');
        this.load.image('explorer-bar', 'assets/backgrounds/explorer-bar.png');
    }

    create() {
        // Initialise scene
        this.background = this.add.tileSprite(this.x, this.y, this.size.width, this.size.height, 'explorer-bg').setOrigin(0, 0);
        this.physics.world.setBounds(this.x, this.y, this.size.width, this.size.height); // Prevents the player from falling through...
        this.navbarHeight = 30; // 30px navbar (bottom, "hard" value)

        // Factor to scale player by
        let scaleFactor = 0.15;
        this.folderScale = 0.1;

        // Initialise external objects
        let player = new Player(this, this.x + this.size.width - 90, this.y, scaleFactor).setOrigin(0, 0);
        let navbar = new ExplorerBar(this);
        this.loadFolders();

        // Scene-wide variables
        this.player = player;
        this.navbar = navbar;
        this.isClosing = false;

        // Collisions
        this.physics.add.collider(this.player, this.folders, this.handleInteractiveCollision, null, this);
        this.physics.add.collider(this.player, this.navbar.background);
        this.physics.add.overlap(this.player, this.navbar.exitOverlay, this.close, null, this);
    }

    update() {
        if (!this.isClosing) {
            this.player.handleInput()
        }
    }

    loadFolders() {
        /**
         * Generates all relevant children folders and randomly positions them.
         * 1. No overlap between folders.
         * 2. Reserve a certain padding at the bottom so that it is always possible to close the explorer.
         */
        this.folders = this.physics.add.staticGroup();
        this.folderPosArr = [];

        // Loop through all objects of childrenArr
        let childrenArr = this.folderData.children;
        childrenArr.forEach(this.generateFolder, this);
    }

    generateFolder(folderObj, i, _) {
        /**
         * Generates a folder in a random location and stores its location in a set
         */

        let verticalPadding = 35;
        let maxY = this.y + this.size.height - this.navbarHeight;
        let maxX = this.x + this.size.width - 90; // ensure accessibility of exit

        // Generate dummy folder first to retrieve the dimensions
        let folder = new Folder(this, 0, 0, folderObj.id, this.folderScale).setOrigin(0, 0);

        let folderCoords = getRandomCoords(this.x, maxX, this.y + verticalPadding, maxY, folder.size); // Don't want it spawning too high either...

        folder.updatePos(folderCoords.x, folderCoords.y);

        this.folders.add(folder);

        // Store position
        this.folderPosArr.push({
            x: folderCoords.x,
            y: folderCoords.y,
            width: folder.size.width,
            height: folder.size.height
        })
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
                console.log(folderData)
                // Executed
                // Don't pause DesktopBase so that the terminal keeps running
                this.sceneTransitionExplorer(folderData, interactiveObj)
            }
            // If null, there was no execution done.
        }
    }

    sceneTransitionExplorer(folderData, interactiveObj) {
        // Generate necessary context for Explorer scene
        let explorerCoords = getRandomCoords(0, this.scene.get('DesktopBase').canvasSize.width, this.scene.get('DesktopBase').spawnTop, this.scene.get('DesktopBase').spawnBottom, this.size);

        // Add current object to stack to identify parent caller
        let explorerStack = this.registry.get('explorerStack');
        explorerStack.push(this.context)
        this.registry.set('explorerStack', explorerStack)

        this.scene.restart({
            'posData': explorerCoords,
            'folderData': folderData,
            'size': this.size,
            'folderObj': interactiveObj, // So we can reset folder state when the Explorer is closed
        });
    }

    close() {
        /**
         * Close the explorer instance
         */
        if (!this.isClosing) {
            this.isClosing = true;
            this.player.destroy();
            this.background.destroy();
            this.navbar.destroy();
            this.folders.clear(true, true)
            this.folderPosArr = [];
            this.folderObj.isOpen = false;

            // Recover parent
            let explorerStack = this.registry.get('explorerStack');
            let parentContext = explorerStack.pop(this.folderObj)
            this.registry.set('explorerStack', explorerStack)

            if (parentContext === null) {
                // Recover desktop
                this.scene.get('DesktopBase').player.enable();
                this.scene.stop();
            } else {
                this.scene.restart(parentContext);
            }
        }
    }
}