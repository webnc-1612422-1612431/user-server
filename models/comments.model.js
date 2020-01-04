var db = require('../utils/db');

module.exports = {

    getByTeacherId: teacherid => {
        return db.load(`select fullname, content, avatar from comment join user on comment.userid = user.id where teacherid = '${teacherid}'`);
    },

    getByStudentId: userid => {
        return db.load(`select fullname, content, avatar from comment join user on comment.userid = user.id where userid = '${userid}'`);
    },

    add: entity => {
        return db.add(`comment`, entity);
    }
}