'use strict'

module.exports = {
    existAny: function (list, func) {
        for (const item of list) {
            if (func(item)) {
                return true;
            }
        }
        return false;
    },

    noneExist: function (list, func) {
        for (const item of list) {
            if (func(item)) {
                return false;
            }
        }
        return true;
    }
}