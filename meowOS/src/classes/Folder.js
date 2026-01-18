
import fileData from '../data/files.json' with { type: 'json' }

export class Folder extends Phaser.GameObjects.Image {
    /***
     * Defines Folder class, with public methods to spawn linked Explorer instances.
     * @param {number} x Starting x-coordinate of folder
     * @param {number} y Starting y-coordinate of folder
     * @param {string} id ID as retrieved from the json file
     */

    constructor(scene, x, y, id, scaleFactor) {
        // Load the icon: Use a random folder sprite
        let folderSprites = [
            'fNormal', 'fGoop', 'fKira', 'fSpikes'
        ]
        let randomSprite = Phaser.Utils.Array.GetRandom(folderSprites);

        super(scene, x, y, randomSprite).setOrigin(0, 0);
        scene.add.existing(this);

        this.setScale(scaleFactor);

        // Class properties
        this.scene = scene;
        this.fileObject = this.findFileById(fileData, id);

        this.id = id
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isOpen = false;
        this.size = {
            'width': this.displayWidth,
            'height': this.displayHeight
        }

        // Add filename label
        this.renderFileName();
    }

    findFileById(data, id) {
        /**
         * gpt generated
         * Recursively search for a file/folder by id in nested children
         * @param {Array|Object} data - The data to search (can be array or single object)
         * @param {string} id - The id to find
         * @returns {Object|null} - The found object or null
         */

        // If data is an array, search each item
        if (Array.isArray(data)) {
            for (let item of data) {
                const result = this.findFileById(item, id);
                if (result) return result;
            }
            return null;
        }

        // If data is an object, check if it matches
        if (data && typeof data === 'object') {
            if (data.id === id) {
                return data;
            }

            // Search in children if they exist
            if (data.children && Array.isArray(data.children)) {
                return this.findFileById(data.children, id);
            }
        }

        return null;
    }

    renderFileName() {
        /**
         * Renders Text object below the file name
         */

        if (this.fileNameLabel) {
            this.fileNameLabel.destroy();
        }

        let fileName = this.fileObject.name;
        this.fileNameLabel = this.scene.add.text(this.x + (this.size.width / 2), this.y + this.size.height + 3, fileName, {
            fontFamily: 'sans-serif',
            fontSize: '16px',
            // strokeThickness: 2,
            // stroke: '#000000',
            color: '#000000',
            wordWrap: { width: 780 }
        }).setOrigin(0.5, 0);
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

        // Shift file name labels
        this.renderFileName()
    }

    onClose() {
        /**
         * Handles the event of folder being closed.
         */

        this.isOpen = false;
    }
}
