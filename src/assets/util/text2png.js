const jimp = require("./jimp");

// convert text to PNG images
// jimp here is compact version. It's been tweaked to work with newline characters, so I don't have to deal with canvas
// this rewrite doesn't have to be usable elsewhere, it's only used in this project

const text2png = async (text, options = {}) => {
  // register some fonts, we call it when we need it
  const registerFont = async () => await jimp.loadFont(options.font);

  // make a temporary 1x1 image to apply changes later
  const img = new jimp(1, 1, 0x00000000);

  // work with alignments
  let alignmentX, alignmentY;
  if (!options.x || options.x === 'left') {
    alignmentX = jimp.HORIZONTAL_ALIGN_LEFT; // align left horizontally by default
  } else if (options.x === 'right') {
    alignmentX = jimp.HORIZONTAL_ALIGN_RIGHT;
  } else if (options.x === 'middle') {
    alignmentX = jimp.HORIZONTAL_ALIGN_MIDDLE;
  }
  
  if (!options.y || options.y === 'middle') {
    alignmentY = jimp.VERTICAL_ALIGN_MIDDLE; // align middle vertically by default
  } else if (options.y === 'top') {
    alignmentY = jimp.VERTICAL_ALIGN_TOP;
  } else if (options.y === 'bottom') {
    alignmentY = jimp.VERTICAL_ALIGN_BOTTOM;
  }

  // measure text for max width and height
  const tWidth = jimp.measureText(await registerFont(), text);
  const tHeight = jimp.measureTextHeight(await registerFont(), text, tWidth);

  // resize image based on those numbers
  // we jimp.AUTO the height so nothing goes wrong
  img.resize(tWidth, jimp.AUTO);

  // manip image
  await registerFont().then(font => {
    // check if we need to use the last 2 params
    if (options.noMax === true) img.print(font, 0, jimp.AUTO, { text, alignmentX, alignmentY });
    else img.print(font, 0, jimp.AUTO, { text, alignmentX, alignmentY }, tWidth, tHeight)
  });

  // export image under buffer format
  return await img.getBufferAsync(jimp.MIME_PNG);
}

// export the function
module.exports = text2png;