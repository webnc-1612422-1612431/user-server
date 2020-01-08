var db = require('../utils/db');

module.exports = {

    all: () => {
        return db.load(`select * from skill where state = 1`);
    },

    add: entity => {
        return db.add(`skill`, entity);
    },

    get: skill => {
        return db.load(`select * from skill where skill = '${skill}'`);
    },

    put: entity => {
        return db.update(`skill`, `skill`, entity);
    },
}