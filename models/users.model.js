var db = require('../utils/db');

module.exports = {

    all: () => {
        return db.load(`select * from user`);
    },

    add: entity => {
        return db.add(`user`, entity);
    },

    get: email => {
        return db.load(`select * from user where email = '${email}'`);
    },

    put: entity => {
        return db.update(`user`, `email`, entity);
    },
}