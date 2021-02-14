'use strict';

const Controller = require('egg').Controller;
const fs = require("fs");

class HomeController extends Controller {
    async index() {
        const {ctx} = this;
        ctx.body = 'hi, egg';
    }

    async share() {
        await this.ctx.render('index.ejs');
    }

    async video() {
        const {ctx} = this;
        let range = ctx.headers.range;
        if (!range) {
            ctx.res.status(400).send("Requires Range header");
        }
        // get video stats (about 61MB)
        const videoPath = "/Users/levy/Downloads/flame-game.of.thrones.conquest.and.rebellion.2017.720p.bluray.x264.mkv";
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
}

module.exports = HomeController;
