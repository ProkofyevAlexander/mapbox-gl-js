function createPaletteTexture(gl, palette) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 256; // number of possible pixel color values, 0..255
    const height = 1;

    // create canvas which is 256px wide and 1px high
    canvas.width = width;
    canvas.height = height;

    palette.values.sort((a, b) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
    });

    let step = (palette.max - palette.min) / (width - 2);
    let canContinue = Array.isArray(palette.values) &&
        palette.values.length &&
        step >= 0;

    if (canContinue) {
        let value = palette.values.shift();
        let currentValue = palette.min;

        for (let i = 1; i < width; i++) {
            if (currentValue >= value.value) {
                context.fillStyle = value.color;
            }
            while (currentValue >= value.value && palette.values.length) {
                value = palette.values.shift();
            }
            currentValue += step;
            // color the pixel on position [x=i, 0] with that fill style
            context.fillRect(i, 0, 1, height);
        }
    }

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, context.getImageData(0, 0, width, height));
    texture.size = width;
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
}

module.exports = createPaletteTexture;