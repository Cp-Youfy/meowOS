
import fileData from '../data/files.json' with { type: 'json' }

export class Folder extends Phaser.GameObjects.Image {
    /***
     * Defines Folder class, with public methods to spawn linked Explorer instances.
     * @param {number} x Starting x-coordinate of folder (from center of sprite)
     * @param {number} y Starting y-coordinate of folder (from center of sprite)
     * @param {string} id ID as retrieved from the json file
     */

    constructor(scene, x, y, id, scaleFactor) {
        // Load the icon: Use a random folder sprite
        let folderSprites = [
            'fNormal', 'fGoop', 'fKira', 'fSpikes'
        ]
        let randomSprite = Phaser.Utils.Array.GetRandom(folderSprites);

        super(scene, x, y, randomSprite);
        scene.add.existing(this);

        this.setScale(scaleFactor);

        // Class properties
        this.scene = scene;
        this.fileObject = fileData.find(item => item.id === id);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isOpen = false;
        this.size = {
            'width': this.displayWidth,
            'height': this.displayHeight
        }
    }

    execute() {
        /**
         * Handle folder opening. Initialises a corresponding Explorer class.
         */
        let keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // If the folder is already open, don't allow repeated execution
        if (keyE.isDown && !this.isOpen) {
            this.isOpen = true;
            return this.fileObject;
        }

        return null
    }

    updatePos(x, y) {
        this.x = x
        this.y = y
    }

    onClose() {
        /**
         * Handles the event of folder being closed.
         */

        this.isOpen = false;
    }
}
