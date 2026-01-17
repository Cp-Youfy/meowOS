export function getRandomCoords(leftX, rightX, topY, bottomY, tabSize) {
    /**
     * Get random coordinates to spawn a new window.
     * topY, bottomY determine the boundary of Y values allowed
     * @param {number} leftX Left boundary x coordinate
     * @param {number} rightX Right boundary x coordinate
     * @param {number} topY Top y coordinate
     * @param {number} bottomY Bottom y coordinate
     * @param {object} tabSize {'width': width, 'height': height} of item size
     * Returns coordinates for top left. May require .setOrigin(0, 0)
     * @returns {object} {'x': x, 'y': y}
     */

    let allowedWidth = rightX - leftX - tabSize.width;
    let allowedHeight = bottomY - topY - tabSize.height;

    let x = leftX + Math.floor(Math.random() * allowedWidth);
    let y = topY + Math.floor(Math.random() * allowedHeight);

    return {
        'x': x,
        'y': y
    }
}