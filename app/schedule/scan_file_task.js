const Subscription = require('egg').Subscription;
const fs = require('fs');
const validFileType = ['mkv', 'mp4'];

class ScanFile extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '24h', // 1 分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行,
            disable: true
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const scanDirs = [];
        const rootDirs = []
        const params = {
            'table': 'tbl_scan_directory',
            'select': ['*']
        }
        db.select(params).forEach(item => {
            scanDirs.push(item['directory_path']);
            rootDirs.push(item['directory_path']);
        });
        while (scanDirs.length !== 0) {
            const tmpDir = scanDirs.pop();
            const files = fs.readdirSync(tmpDir);
            files.forEach(item => {
                const target = tmpDir + '/' + item;
                const stat = fs.statSync(target)
                if (stat.isDirectory()) {
                    scanDirs.push(target);
                } else if (validFileType.includes(getFileType(target))) {
                    fileService.dealFile(target, item, tmpDir, rootDirs.includes(tmpDir));
                }
            })
        }
    }
}

function getFileType(filePath) {
    const lastPointIndex = filePath.lastIndexOf('.') + 1;
    return lastPointIndex > 0 ? filePath.toLowerCase().substring(lastPointIndex) : filePath;
}

module.exports = ScanFile;