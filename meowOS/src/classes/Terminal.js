export class Terminal {
    /***
     * Defines a Terminal class that logs key inputs.
     * Position fixed to fill bottom 30% of the screen.
     */

    constructor(scene) {
        // Positioning
        let xPos = 0
        let yPos = 504
        let textPad = 20

        // Initialise class properties
        this.scene = scene;
        this.buffer = [];
        this.showCursor = true;

        // Temporary background (to replace with image)
        this.background = this.scene.add.rectangle(xPos, yPos, 1280, 300, 0x000000, 1).setOrigin(0, 0);
        this.scene.physics.add.existing(this.background, 1);

        this.text = scene.add.text(xPos + textPad, yPos + textPad, '', {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 780 }
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Event handlers
        this.scene.input.keyboard.on('keydown', this.keyDown, this);
        this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                this.showCursor = !this.showCursor;
                this.updateDisplay()
            }
        })
    }

    keyDown(event) {
        let k = event.key;

        // Input
        if (k.length === 1) {
            this.buffer.push(k);
        }

        // Delete text
        if (k === 'Backspace') {
            this.buffer.pop();
        }

        // Newline
        if (k === 'Enter') {
            this.buffer.push('\n')
        }

        this.updateDisplay()
    }

    updateDisplay() {
        let displayText = this.buffer.join('');

        // Add blinking cursor
        if (this.showCursor) {
            displayText += '█';
        }

        this.text.setText(displayText);
    }

    write(line) {
        /**
         * Manually write some output to the terminal
         */
        this.buffer.push(line + '\n');
        this.text.setText(this.buffer.join(''));
    }

    clear() {
        this.buffer.length = 0;
        this.text.setText('');
    }

    destroy() {
        this.scene.input.keyboard.off('keydown', this.onKey, this);
        this.text.destroy();
    }

}
