var db = require('../utils/db');

module.exports = {

    add: entity => {
        return db.add(`complain`, entity);
    },

    get: contractid => {
        return db.load(`SELECT * from complain where contractid = ${contractid}`)
    }
}