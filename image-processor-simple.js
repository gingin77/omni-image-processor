const fs = require("fs"),
  path = require("path"),
  sharp = require("sharp");

var filePath = process.argv.slice(2)[0];

class ImageProcessor {
  constructor(filePath) {
    this.filePath = filePath;
    this.basename = path.parse(filePath).base;
  }

  getStreams() {
    const dir = "./processed";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    
    const inputPath = this.filePath;
    const outputPath = path.join(dir, this.basename);

    return {
      readStream: fs.createReadStream(inputPath),
      writeStream: fs.createWriteStream(outputPath),
    };
  }

  processImage() {
    const { readStream, writeStream } = this.getStreams();

    const pipeline = sharp().rotate().resize({
      fit: sharp.fit.contain,
      width: 800,
    });

    readStream.pipe(pipeline).pipe(writeStream);
  }
}

let ip = new ImageProcessor(filePath);
ip.processImage()
