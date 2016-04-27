var argv = require('minimist')(process.argv.slice(2));
var Jimp = require("jimp");
var fs = require('fs');
var file, cols, outputFile;
if(argv['_'].length) {
    file = argv['_'][0];
    cols = argv['cols'] || 40;
    outputFile = argv['o'];
} else {
    console.log("Usage:\n");
    console.log("image-to-console <inputfile> --cols 30 --o <outputfile>");
    return;
}


Jimp.read(process.argv[2], function (err, image) {
    if(err) {
        console.log(err);
    } else {
        var resized = image.resize(cols, Jimp.AUTO);
        var width = resized.bitmap.width;
        var height = resized.bitmap.height;
        var output = ["if (window.console) {", "\tconsole.clear();"];

        for(y=0;y<height;y++) {
            var chars = [];
            var styles = [];

            for(x=0;x<width;x++) {
                styles.push("'background-color: #" +  resized.getPixelColor(x, y).toString(16).substr(0,6) + "'");
                chars.push("%c  ");
            }

            output.push("\tconsole.log('" + chars.join("") + "', " + styles.join(', ') + "); ");
        }

    }

    output.push("}");

    if(outputFile) {
        fs.writeFile(outputFile, output.join("\n"));
    } else {
        console.log("Copy this code:\n\n\n");
        console.log(output.join("\n"));

    }
});