import { getRandomCoords } from '../methods/randomMethods.js';

export class Antivirus {
    /***
     * Defines Antivirus class that acts as a background object and event handler for the bullet hell random event.
     */

    constructor(scene) {
        this.scene = scene;

        // Ad object
        this.adBackground = null;
        this.adText = null;
        this.collider = null;
    }

    setupLoop() {
        /**
         * Antivirus uses a mix of timers and probabilistic-based approach to "scan for viruses" and trigger fixed / random events.
         */

    }

    initAd() {
        // Don't create ad if one already exists
        if (this.adBackground) return;

        // 200x150 popup on a random screen location (within bounds). Bump to dismiss.
        let adSize = {
            'width': 200,
            'height': 150
        }

        // Create the ad appearance
        let adCoords = getRandomCoords(0, this.scene.canvasSize.width, this.scene.spawnTop, this.scene.spawnBottom, adSize);
        let textPad = 10

        this.adBackground = this.scene.add.rectangle(adCoords.x, adCoords.y, 200, 160, 0x00ff00, 1).setOrigin(0, 0);
        this.scene.physics.add.existing(this.adBackground, true); // Changed 1 to true

        this.adText = this.scene.add.text(adCoords.x + textPad, adCoords.y + textPad, "Your meowANTIVIRUS subscription is about to expire! meowANTIVIRUS protects 9 billion cats from virus everyday. Don't stay unprotected! Upgrade to PREMIUM!", {
            fontFamily: 'sans-serif',
            fontSize: '16px',
            color: '#000000',
            wordWrap: { width: adSize.width - (2 * textPad) }
        }).setOrigin(0, 0);

        // Create collision after ad exists
        this.collider = this.scene.physics.add.overlap(
            this.scene.player,
            this.adBackground,
            () => this.startCloseTimer(),
            null,
            this
        );
    }

    startCloseTimer() {
        // Only start timer if not already overlapping
        if (!this.isOverlapping) {
            this.isOverlapping = true;

            // Start 2 second timer
            this.closeTimer = this.scene.time.delayedCall(2000, () => {
                this.closeAd();
            }, [], this);
        }
    }

    stopCloseTimer() {
        // Cancel timer if player stops overlapping
        if (this.closeTimer) {
            this.closeTimer.remove();
            this.closeTimer = null;
        }
        this.isOverlapping = false;
    }

    closeAd() {
        // Destroy background
        if (this.adBackground) {
            this.adBackground.destroy();
            this.adBackground = null;
        }

        // Destroy text
        if (this.adText) {
            this.adText.destroy();
            this.adText = null;
        }

        // Destroy collider
        if (this.collider) {
            this.collider.destroy();
            this.collider = null;
        }

        // Clean up timer
        if (this.closeTimer) {
            this.closeTimer.remove();
            this.closeTimer = null;
        }

        this.isOverlapping = false;
    }
}