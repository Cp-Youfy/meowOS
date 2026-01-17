
import fileData from '../data/files.json' with { type: 'json' }

export class Folder extends Phaser.GameObjects.Image {
    /***
     * Defines Folder class, with public methods to spawn linked Explorer instances.
     * @param {number} x Starting x-coordinate of folder (from center of sprite)
     * @param {number} y Starting y-coordinate of folder (from center of sprite)
     * @param {string} id ID as retrieved from the json file
     */

    constructor(scene, x, y, id) {
        // Load the icon
        super(scene, x, y, 'folder');
        scene.add.existing(this);

        this.setScale(0.15);

        // Class properties
        this.scene = scene;
        this.fileObject = fileData.find(item => item.id === id);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isOpen = false;
    }

    execute() {
        /**
         * Handle folder opening. Initialises a corresponding Explorer class.
         */
        let keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        let currentTime = this.scene.time.now;

        // If the folder is already open, don't allow repeated execution
        if (keyE.isDown && !this.isOpen) {
            console.log("Entry");
            this.isOpen = true;
        }
    }

    onClose() {
        /**
         * Handles the event of folder being closed.
         */

        this.isOpen = false;
    }
}