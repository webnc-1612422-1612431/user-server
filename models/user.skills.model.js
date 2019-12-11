var db = require('../utils/db');

module.exports = {

    all: () => {
        return db.load(`select * from user_skill`);
    },

    add: entity => {
        return db.add(`user_skill`, entity);
    },

    getByUser: userid => {
        return db.load(`select * from user_skill where userid = '${userid}'`);
    },

    getBySkill: skillid => {
        return db.load(`select * from user_skill where skillid = '${skillid}'`);
    },

    removeByUser: userid => {
        return db.load(`delete from user_skill where userid = '${userid}'`)
    }
}