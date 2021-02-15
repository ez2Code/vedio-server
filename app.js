'use strict';

const fs = require('fs')

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async didReady() {
        // 应用已经启动完毕
        const ctx = await this.app.createAnonymousContext();
        AppBootHook.initSqlite(ctx);
    }

    static initSqlite(ctx) {
        const Database = require('better-sqlite3');
        ctx.app.sqlite3 = new Database(ctx.app.config.sqlitePath);
        const sql = fs.readFileSync('video.sql', 'utf8');
        sql.split('#####').forEach(item => {
            ctx.app.sqlite3.exec(item);
        })
    }
}

module.exports = AppBootHook;

