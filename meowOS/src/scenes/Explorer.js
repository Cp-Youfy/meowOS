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
        this.load.image('explorer-bg', 'assets/backgrounds/explorer.png')
    }

    create() {
        // Initialise scene
        this.background = this.add.tileSprite(this.x, this.y, this.size.width, this.size.height, 'explorer-bg').setOrigin(0, 0);
        this.physics.world.setBounds(this.x, this.y, this.size.width, this.size.height); // Prevents the player from falling through...


        // Initialise external objects
        let player = new Player(this, this.x, this.y).setOrigin(0, 0);
        this.loadFolders();

        // Scene-wide variables
        this.player = player;
    }

    update() {
        this.player.handleInput()
    }

    loadFolders() {
        /**
         * TODO
         * Generates all relevant children folders and randomly positions them without overlap
         */
        this.folders = this.physics.add.staticGroup();

        // let folder1 = new Folder(this, 200, 400, "1");
        // this.folders.add(folder1);

    }

    close() {
        /**
         * Close the explorer instance
         */
        this.scene.stop('Explorer');
    }
}