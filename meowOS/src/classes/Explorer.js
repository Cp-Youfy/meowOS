export class Explorer {
    /***
     * Defines Explorer class, an interactive UI element that can be populated with files / directories that recursively spawn their own relevant Explorer windows.
     */

    constructor(scene) {
        // Spawn the Explorer window in a random location within the screen boundaries

        this.background = this.add.rectangle(100, 100, 500, 300, 0x000000, 1).setOrigin(0, 0);
    }
}