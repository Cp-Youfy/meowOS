export class ExplorerBar {
    /***
     * Defines a ExplorerBar class acting as a StaticBody for collision purposes.
     * Height: 33px
     */

    constructor(scene) {
        // Positioning
        let xPos = scene.x
        let yPos = scene.y + (scene.size.height - scene.navbarHeight)

        // Initialise class properties
        this.scene = scene;

        // Initialise visible StaticBody object
        this.background = this.scene.add.image(xPos, yPos, 'explorer-bar').setOrigin(0, 0);
        //this.background.setDisplaySize(scene.size.width, scene.navbarHeight);
        this.scene.physics.add.existing(this.background, 1);

    }


}
