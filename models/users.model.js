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

    getTeacherByMajor: major => {
        return db.load(`select * from user where role = 'teacher' and major = '${major}'`)
    },

    getAllTeachers: () => {
        return db.load(`select *, avg(rate) as rate from user left join contract on user.id = contract.teacherid where user.role = 'teacher' group by user.id`);
    }
}