import { Player } from '../classes/Player.js';
import { Folder } from '../classes/Folder.js';
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
        this.x = context.posData.x;
        this.y = context.posData.y;
        this.folderData = context.folderData;
        this.size = context.size;
    }

    preload() {
        this.load.image('explorer-bg', 'assets/backgrounds/explorer.png');
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
        let player = new Player(this, this.x, this.y, scaleFactor).setOrigin(0, 0);
        this.loadFolders();

        // Scene-wide variables
        this.player = player;

        // Collisions
        this.physics.add.collider(player, this.folders, this.handleInteractiveCollision, null, this);
    }

    update() {
        this.player.handleInput()
    }

    loadFolders() {
        /**
         * TODO
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

        let maxY = this.y + this.size.height - this.navbarHeight - 40; // 40 is arbitrary padding
        let maxX = this.x + this.size.width;

        // Generate dummy folder first to retrieve the dimensions
        let folder = new Folder(this, 0, 0, folderObj.id, this.folderScale).setOrigin(0, 0);

        let folderCoords = getRandomCoords(this.x, maxX, this.y, maxY, folder.size);

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
                // Executed
                // Don't pause DesktopBase so that the terminal keeps running
                this.sceneTransitionExplorer(folderData)
            }
            // If null, there was no execution done.
        }
    }

    close() {
        /**
         * Close the explorer instance
         */
        this.scene.stop('Explorer');
    }
}