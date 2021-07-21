const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

http.createServer((request, response) => {
    response.setHeader('Content-Type', 'text/html');
    let dirToRead = __dirname;
    if (request.method && request.method === 'GET') {
        const queryParams = url.parse(request.url, true).query.selected;
        if(queryParams) {
            if(isFile(queryParams)) {
                response.write(`File: ${queryParams}`);
                response.end('');
            }
            dirToRead = queryParams;
        }
    }
     fs.readdirSync(dirToRead).forEach(item => {
            response.write(`<p><a href="index.js?selected=${ item }">${ item }</a></p>`);
     });


    response.end('');



}).listen(3000, 'localhost');