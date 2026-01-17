
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
    }
}