const fs = require('fs');
const readline = require('readline');
const IP = ['89.123.1.41','34.48.240.111'];
const sourceFile = 'data/access.log';

let writeStreams = [];

console.time('reading');
fs.stat(sourceFile, function(err, stat) {
    const filesize = stat.size;
    let bytesRead = 0;

    const cons = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const y = cons.getCursorPos().rows;

    const readStream = fs.createReadStream(sourceFile, 'utf8');
    IP.forEach(ip => {
        writeStreams.push(fs.createWriteStream(`%${ip}%_requests.log`, {flags: 'a', encoding: 'utf8'}));
    });

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
        bytesRead += line.length;
        log(`Progress: ${((bytesRead / filesize) * 100).toFixed(2)}%`);
        IP.forEach((ip, index) => {
            if (line.startsWith(ip)) {
                writeStreams[index].write(line + '\n');
            }
        });
    });

    rl.on('error', err => console.log(err))
    readStream.on('error', err => console.log(err));
});