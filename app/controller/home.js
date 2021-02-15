'use strict';

const Controller = require('egg').Controller;
const fs = require("fs");
const commonUtil = require('../utils/common');

class HomeController extends Controller {
    async index() {
        const currentPath = this.ctx.query['currentPath'];
        const rootDirectories = [];
        const params = {
            'table': 'tbl_scan_directory',
            'select': ['*']
        };
        this.ctx.service.sqlite.select(params).forEach(item => {
            rootDirectories.push({
                'name': item['directory_name'],
                'path': item['directory_path']
            });
        })
        const data = {};
        if (!!currentPath && commonUtil.existAny(rootDirectories, item => currentPath.startsWith(item['path']))) {
            const children = this.ctx.service.directoryScanner.scan(currentPath);
            data['currentDirectories'] = [{
                'path': getParentPath(currentPath),
                'name': '..'
            }].concat(children['directories']);
            data['fileList'] = children['files']
        } else {
            data['currentDirectories'] = rootDirectories;
            data['fileList'] = [];
        }
        await this.ctx.render('index.ejs', data);
    }

    async player() {
        await this.ctx.render('player.ejs', {file: this.ctx.query['file']});
    }

    async video() {
        const {ctx} = this;
        let range = ctx.headers.range;
        if (!range) {
            ctx.res.status(400).send("Requires Range header");
        }
        // get video stats (about 61MB)
        const videoPath = this.ctx.query['file'];
        const videoSize = fs.statSync(videoPath).size;
        // Parse Range
        // Example: "bytes=32324-"
        const fixed_chunk_size = 10 ** 6; // 1MB
        range = range.split('=')[1];
        const rangeArray = range.split('-')
        const start = parseInt(rangeArray[0]);
        let end = 0;
        if (!!rangeArray[1]) {
            end = parseInt(rangeArray[1]);
        } else {
            end = Math.min(start + fixed_chunk_size, videoSize - 1);
        }
        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        this.ctx.res.writeHead(206, headers)
        // create video read stream for this particular chunk
        // Stream the video chunk to the client
        this.ctx.body = fs.createReadStream(videoPath, {start, end});
    }

    async addRoot() {
        const directory = this.ctx.query['directory'];
        const params = {
            'table': 'tbl_scan_directory',
            'values': {
                'directory_path': directory,
                'directory_name': getFileName(directory)
            }
        }
        if (fs.statSync(directory).isDirectory()) {
            this.ctx.service.sqlite.insert(params);
        }
        this.ctx.body = 'ok';
    }

}

function getParentPath(currentPath) {
    const lastPointIndex = currentPath.lastIndexOf('/');
    return lastPointIndex > 0 ? currentPath.substring(0, lastPointIndex) : currentPath;
}

function getFileName(currentPath) {
    const lastPointIndex = currentPath.lastIndexOf('/') + 1;
    return lastPointIndex > 0 ? currentPath.substring(lastPointIndex) : currentPath;
}

module.exports = HomeController;
