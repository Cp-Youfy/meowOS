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

        // Temporary background (to replace with image)
        scene.add.rectangle(xPos, yPos, 1280, 300, 0x000000, 1).setOrigin(0, 0);

        this.text = scene.add.text(xPos + textPad, yPos + textPad, '', {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 780 }
        });

        // Event handlers
        scene.input.keyboard.on('keydown', this.keyDown, this);

        // Class variables
        this.scene = scene
        this.buffer = []
    }

    keyDown(event) {
        let k = event.key

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
        this.text.setText(this.buffer.join(''));
    }

    write(line) {
        /**
         * Manually write some output to the terminal
         */
        this.buffer.push('\n' + line);
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
