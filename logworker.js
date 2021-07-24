const fs = require('fs');
const { workerData, parentPort } = require('worker_threads');
const readline = require('readline');
const IP = ['89.123.1.41','34.48.240.111'];

const { sourceFile } = workerData;
let writeStreams = [];

console.log(`in worker... ${sourceFile}`);

fs.stat(sourceFile, function(err, stat) {
    const filesize = stat.size;
    let bytesRead = 0, timerID = null;

    console.log(`Source file size: ${filesize}`);

    const readStream = fs.createReadStream(sourceFile, 'utf8');
    IP.forEach(ip => {
        writeStreams.push(fs.createWriteStream(`%${ip}%_requests.log`, {flags: 'a', encoding: 'utf8'}));
    });
    console.log('Streams created');
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });
    timerID = setInterval(() => {
        parentPort.postMessage( ((bytesRead / filesize) * 100).toFixed(2) );
        writeStreams.forEach((writeStream, index) => console.log(`written in stream ${index} amount of ${writeStream.bytesWritten}`));
    },1000);
    rl.on('line', (line) => {
        bytesRead += line.length;
        IP.forEach((ip, index) => {
            if (line.startsWith(ip)) {
                writeStreams[index].write(line + '\n');
            }
        });
    });
    rl.on('close',() => {
        console.log('Finished processing file');
        parentPort.postMessage(100);
        clearInterval(timerID);
    });
    writeStreams.forEach((writeStream, index) => writeStream.on('close', () => console.log(`Writestream ${index} finished`)));
    rl.on('error', err => console.log(err))
    readStream.on('error', err => console.log(err));
});