import { Start } from './scenes/Start.js';
import { DesktopBase } from './scenes/Desktop.js'
import { Explorer } from './scenes/Explorer.js'

const config = {
    type: Phaser.AUTO,
    title: 'meowOS',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true,
            fps: 120
        }
    },
    pixelArt: false,
    scene: [
        DesktopBase,
        Start,
        Explorer
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
