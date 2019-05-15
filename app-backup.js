const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const promisify = require('util').promisify;
const mime = require('mime');

const compress = require('./lib/compress');
const conf = require('./config/defaultConfig');
const template = handlebars.compile(fs.readFileSync('./template/index.html', 'utf-8'));

const getMime = (filepath) => {
    const extname = path.extname(filepath).slice(1);
    return mime.getType(extname);
}

const server = http.createServer(async (req, res) => {
    const filepath = path.join(__dirname, req.url);
    if (filepath.includes('favicon')) return;
    try {
        const stats = await promisify(fs.stat)(filepath);
    
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', getMime(filepath));
            let rs = fs.createReadStream(filepath);
            if (filepath.match(conf.compress))  {
                console.log('文件类型匹配');
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            const files = await promisify(fs.readdir)(filepath);

            const dir = path.relative(process.cwd(), filepath);
            const title = path.basename(filepath);

            res.end(template({ title, files, dir }));
        }
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 400;
        res.end(`${filepath} is not a dir or file!`);
    }
});

server.listen(conf.port, conf.hostname, () => {
    console.log(`Server started at ${chalk.green(conf.hostname + ':' + conf.port)}`);
});