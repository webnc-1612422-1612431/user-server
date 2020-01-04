var db = require('../utils/db');

module.exports = {
    
    getByUserId: (userid, isTeacherView) => {
        const key1 = isTeacherView ? 'request.studentid' : 'request.teacherid';
        const key2 = isTeacherView ? 'teacherid' : 'studentid';

        return db.load(`SELECT request.id, request.isaccept, request.dayperweek, request.hourperday, `
        + `DATE_FORMAT(request.startdate,'%m/%d/%Y') AS start, `
        + `DATE_FORMAT(request.enddate,'%m/%d/%Y') AS end, `
        + `user.fullname, user.avatar, user.email, user.price, `
        + `skill.skill FROM request left join user on ${key1} = user.id `
        + `left join skill on request.skill = skill.id where ${key2} = '${userid}'`)
    },

    update: entity => {
        return db.update(`request`, `id`, entity);
    },

    delete: requestid => {
        return db.delete(`request`, `id`, requestid);
    },

    add: entity => {
        return db.add(`request`, entity);
    },

    get: id => {
        return db.load(`SELECT * from request where id = ${id}`);
    }
}