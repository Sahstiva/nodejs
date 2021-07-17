const fs = require('fs');
const readline = require('readline');
const sourceFile = 'data/access.log';
const path = require("path");
const MAX_LINES = 200;


    console.time('reading');
    fs.stat(sourceFile, function(err, stat) {
        const filesize = stat.size;
        let bytesRead = 0;
        let countLines = 0;

        const cons = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const y = cons.getCursorPos().rows + 1;

        const readStream = fs.createReadStream(sourceFile, 'utf8');
        const output = path.parse(sourceFile);
        const writeStream = fs.createWriteStream(output.dir + '/' + output.name + MAX_LINES + output.ext, {flags: 'a', encoding: 'utf8'});

        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        function log(message) {
            readline.cursorTo(process.stdout, 0,y);
            console.log(message);
            cons.prompt(true);
        }

        rl.on('line', (line) => {
            if(countLines < MAX_LINES) {
                bytesRead += line.length;
                if(line.length > 0) {
                    log(`Progress: ${((MAX_LINES / countLines++) * 100).toFixed(2)}% (${bytesRead} bytes)`);
                    writeStream.write(line + '\n');
                }
            } else {
                rl.close();
                readStream.destroy();
                //process.exit(0);
            }
        });

        rl.on('error', err => console.log(err))
        readStream.on('error', err => console.log(err));
    });


