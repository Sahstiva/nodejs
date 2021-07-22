const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
let cwd = __dirname;

const isFile = fileName => {
    return fs.lstatSync(cwd + '\\' + fileName).isFile();
}

http.createServer((request, response) => {
    response.setHeader('Content-Type', 'text/html');
    cwd = process.cwd();
    if (request.method && request.method === 'GET') {
        const queryParams = url.parse(request.url, true).query.selected;
        if(queryParams) {
            if(isFile(queryParams)) {
                response.write(`<p>File: ${queryParams}</p>`);
                let data = fs.readFileSync(queryParams);
                response.write(`<textarea cols="140" rows="30">${data}</textarea><p></p>`);

            }
            else {
                process.chdir(queryParams);
                cwd = process.cwd();
            }
        }
    }
    response.write(`Current dir: ${cwd}`);
    response.write(`<p><a href="index.js?selected=.">.</a>`);
    response.write(`<p><a href="index.js?selected=..">..</a>`);
     fs.readdirSync(cwd).forEach(item => {
            response.write(`<p><a href="index.js?selected=${ item }">${ item }</a></p>`);
     });

    response.end('');



}).listen(3000, 'localhost');