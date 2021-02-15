'use strict'

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const commonUtil = require('../utils/common');

class DirectoryScannerService extends Service {
    scan(currentDir) {
        const files = fs.readdirSync(currentDir);
        const result = {
            'files': [],
            'directories': []
        }
        files.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const oneFile = {
                'name': item,
                'path': fullPath
            }
            if (fs.statSync(fullPath).isDirectory()) {
                result['directories'].push(oneFile);
            } else if (isValidFile(item)) {
                result['files'].push(oneFile);
            }
        });
        return result;
    }
}


const validFileType = ['mkv', 'mp4'];

function isValidFile(filePath) {
    return commonUtil.existAny(validFileType, item => item === getFileType(filePath));
}

function getFileType(filePath) {
    const lastPointIndex = filePath.lastIndexOf('.') + 1;
    return lastPointIndex > 0 ? filePath.toLowerCase().substring(lastPointIndex) : filePath;
}

module.exports = DirectoryScannerService;