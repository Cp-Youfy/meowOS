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

    create() {
        // Initialise scene
        this.background = this.add.rectangle(this.x, this.y, this.size.width, this.size.height, 0xff0000, 1).setOrigin(0, 0); // to replace with image

        // Initialise external objects


    }

    close() {
        /**
         * Close the explorer instance
         */
        this.scene.stop('Explorer');
    }
}