'use strict'

const Service = require('egg').Service;

class SqliteService extends Service {
    insert(params) {
        let sql = 'insert into ' + params['table'] + '(';
        const filed = [];
        const placeholder = [];
        const values = [];
        for (const v of Object.keys(params['values'])) {
            filed.push(v);
            values.push(params['values'][v]);
            placeholder.push('?');
        }
        sql += filed.join(',') + ') values(' + placeholder.join(',') + ')';
        if (params['extra']) {
            sql += ' ' + params['extra'];
        }
        const stmt = this.app.sqlite3.prepare(sql)
        stmt.run(values);
    }

    select(params) {
        let sql = 'select ' + params['select'].join(',') + ' from ' + params['table'];
        const param = [];
        const wheres = [];
        if (params['eq']) {
            for (const key of Object.keys(params['eq'])) {
                wheres.push(key + '=?');
                param.push(params['eq'][key]);
            }
        }
        if (params['like']) {
            for (const key of Object.keys(params['like'])) {
                wheres.push(key + ' like ?');
                param.push(params['like'][key]);
            }
        }
        if (params['gt']) {
            for (const key of Object.keys(params['gt'])) {
                wheres.push(key + '>?');
                param.push(params['gt'][key]);
            }
        }
        if (params['lt']) {
            for (const key of Object.keys(params['lt'])) {
                wheres.push(key + '<?');
                param.push(params['lt'][key]);
            }
        }
        if (wheres.length > 0) {
            sql += ' where ' + wheres.join(' and ');
        }
        if (params['group']) {
            sql += ' group by ' + params['group'].join(',');
        }
        if (params['order']) {
            const tmp = [];
            for (const key of Object.keys(params['order'])) {
                tmp.push(key + ' ' + params['order'][key]);
            }
            sql += ' order by ' + tmp.join(',');
        }
        if (params['pageNo'] >= 0 && params['pageSize'] > 0) {
            sql += ' limit ' + params['pageNo'] * params['pageSize'] + ',' + params['pageSize'];
        }
        return this.app.sqlite3.prepare(sql).all(param);
    }

    update(params) {
        let sql = 'update ' + params['table'] + ' set ';
        const updates = [];
        const param = [];
        for (const key of Object.keys(params['update'])) {
            updates.push(key + '=?');
            param.push(params['update'][key]);
        }
        sql += updates.join(',');
        const wheres = [];
        if (params['eq']) {
            for (const key of Object.keys(params['eq'])) {
                wheres.push(key + '=?');
                param.push(params['eq'][key]);
            }
        }
        if (params['gt']) {
            for (const key of Object.keys(params['gt'])) {
                wheres.push(key + '>?');
                param.push(params['gt'][key]);
            }
        }
        if (params['lt']) {
            for (const key of Object.keys(params['lt'])) {
                wheres.push(key + '<?');
                param.push(params['lt'][key]);
            }
        }
        if (wheres.length > 0) {
            sql += ' where ' + wheres.join(' and ');
        }
        return this.app.sqlite3.prepare(sql).run(param);
    }
}

module.exports = SqliteService;