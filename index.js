const fs = require('fs');
const readline = require('readline');
const yargs = require("yargs");
const path = require("path");
const inquirer = require("inquirer");
const IP = ['89.123.1.41','34.48.240.111'];
let cwd = __dirname;

let writeStreams = [];

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

const options = yargs
    .usage("Usage: -p <path>")
    .option("p", { alias: "path", describe: "Path to file", type: "string", demandOption: false })
    .argv;

const cons = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if(options.path) {
    if(isFile(path.join(cwd, options.path)))
        readfile(path.join(cwd, options.path));
    else {
        cwd = cwd + '/' + options.path;
        getfile(fs.readdirSync(options.path));
    }

}
else {
    console.log('Файл для чтения не задан.');
    cons.question("Введите имя и путь к файлу или нажмите ENTER для выбора: ", function (input) {
        if(input === '') {
            getfile(fs.readdirSync(cwd));
        } else {
            readfile(path.join(cwd, input));
        }
    });
}
function getfile(list) {
    inquirer
        .prompt([{
            name: "fileName",
            type: "list",
            message: "Choose file:",
            choices: list,
        }])
        .then((answer) => {
            if(isFile(path.join(cwd,answer.fileName)))
                readfile(path.join(cwd, answer.fileName));
            else {
                cwd = cwd + '/' + answer.fileName;
                getfile(fs.readdirSync(answer.fileName));
            }
        });
}
function readfile(sourceFile) {
    console.log('SOURCE = ' + sourceFile);
    console.time('reading');
    fs.stat(sourceFile, function(err, stat) {
        const filesize = stat.size;
        let bytesRead = 0;

        const readStream = fs.createReadStream(sourceFile, 'utf8');
        IP.forEach(ip => {
            writeStreams.push(fs.createWriteStream(`%${ip}%_requests.log`, {flags: 'a', encoding: 'utf8'}));
        });

        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            bytesRead += line.length;
            //log(`Progress: ${((bytesRead / filesize) * 100).toFixed(2)}%`);
            IP.forEach((ip, index) => {
                if (line.startsWith(ip)) {
                    writeStreams[index].write(line + '\n');
                }
            });
        });

        rl.on('end', () => console.log('Done'));
        rl.on('error', err => console.log(err))
        readStream.on('error', err => console.log(err));
    });
}


