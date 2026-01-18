import fileData from '../data/files.json' with { type: 'json' }

export class Bomb extends Phaser.GameObjects.Image {
    /***
     * Defines Bomb class, with public methods to spawn the bomb game scene.
     * @param {number} x Starting x-coordinate of bomb icon (from center of sprite)
     * @param {number} y Starting y-coordinate of bomb icon (from center of sprite)
     * @param {number} scaleFactor Scale factor for the bomb icon
     */

    constructor(scene, x, y, scaleFactor) {
        super(scene, x, y, 'bomb');
        scene.add.existing(this);

        this.setScale(scaleFactor);

        // Class properties
        this.scene = scene;
        this.fileObject = fileData.find(item => item.id === 'bomb');
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isOpen = false;
        this.size = {
            'width': this.displayWidth,
            'height': this.displayHeight
        }
    }

    execute() {
        // If the app is already open, don't allow repeated execution
        if (!this.isOpen) {
            this.isOpen = true;
            this.scene.scene.launch('bombApp');
            return this.fileObject;
        }

        return null
    }

    updatePos(x, y) {
        this.x = x
        this.y = y
    }

    onClose() {
        this.isOpen = false;
    }
}