export function getRandomCoords(canvasSize, topY, bottomY, tabSize) {
    /**
     * Get random coordinates to spawn a new window.
     * topY, bottomY determine the boundary of Y values allowed
     * @param {object} canvasSize {'width': width, 'height': height} of canvasSize
     * @param {number} topY Top y coordinate
     * @param {number} bottomY Bottom y coordinate
     * @param {object} tabSize {'width': width, 'height': height} of item size
     * Returns coordinates for top left. May require .setOrigin(0, 0)
     * @returns {object} {'x': x, 'y': y}
     */

    let allowedWidth = canvasSize.width - tabSize.width;
    let allowedHeight = bottomY - tabSize.height;

    let x = Math.floor(Math.random() * allowedWidth);
    let y = Math.floor(Math.random() * allowedHeight);

    // If the item height is too small, move it to the minimum height
    if (y < topY) {
        y = topY;
    }

    return {
        'x': x,
        'y': y
    }
}