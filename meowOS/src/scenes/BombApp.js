export class BombApp extends Phaser.Scene {
    constructor() {
        super('bombApp');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Display game over screen
        this.add.text(
            width / 2,
            height / 2,
            'You lost!\ntry again',
            {
                fontSize: '64px',
                fill: '#ff0000',
                align: 'center'
            }
        )

    }
}