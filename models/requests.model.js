var db = require('../utils/db');

module.exports = {
    
    getByTeacherId: teacherid => {
        return db.load(`SELECT request.id, request.isaccept, request.dayperweek, request.hourperday, `
        + `DATE_FORMAT(request.startdate,'%m/%d/%Y') AS start, `
        + `DATE_FORMAT(request.enddate,'%m/%d/%Y') AS end, `
        + `user.fullname, user.avatar, user.email, `
        + `skill.skill FROM request left join user on request.studentid = user.id `
        + `left join skill on request.skill = skill.id where teacherid = '${teacherid}'`)
    },

    update: entity => {
        return db.update(`request`, `id`, entity);
    }
}