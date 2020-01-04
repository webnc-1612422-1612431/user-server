var db = require('../utils/db');

module.exports = {

    getByTeacherId: teacherid => {
        return db.load(`SELECT contract.description, contract.rate, contract.state, DATE_FORMAT(contract.startdate,'%d/%m/%Y') AS start, `
            + `DATE_FORMAT(contract.enddate,'%d/%m/%Y') AS end, skill.skill FROM contract join skill on contract.skillid = skill.id where contract.teacherid = '${teacherid}'`)
    },

    countByTeacherId: teacherid => {
        return db.load(`select count(*) as count, `
            + `coalesce(sum(coalesce(revenue,0)),0) as sum, `
            + `avg(rate) as rate, `
            + `sum(case when state = 2 then 1 else 0 end) as success from contract where teacherid = '${teacherid}'`);
    },

    topTenRate: () => {
        return db.load(`SELECT user.*, `
            + `sum(case when state = 2 then 1 else 0 end) as success, `
            + `avg(rate) as rate FROM contract join user on contract.teacherid = user.id `
            + `group by teacherid order by rate desc, success desc limit 9`);
    },

    topTenContractNumbers: () => {
        return db.load(`SELECT user.*, `
            + `sum(case when state = 2 then 1 else 0 end) as success, `
            + `avg(rate) as rate FROM contract join user on contract.teacherid = user.id `
            + `group by teacherid order by success desc, rate desc limit 9`);
    },

    getByUserId: (userid, isTeacherView) => {
        const key1 = isTeacherView ? 'contract.studentid' : 'contract.teacherid';
        const key2 = isTeacherView ? 'teacherid' : 'studentid';

        return db.load(`SELECT contract.id, contract.state, contract.revenue, `
            + `DATE_FORMAT(contract.startdate,'%m/%d/%Y') AS start, `
            + `DATE_FORMAT(contract.enddate,'%m/%d/%Y') AS end, `
            + `DATE_FORMAT(contract.signeddate,'%m/%d/%Y') AS signeddate, `
            + `user.fullname, `
            + `skill.skill FROM contract left join user on ${key1} = user.id `
            + `left join skill on contract.skillid = skill.id where ${key2} = '${userid}'`)
    },

    getDetail: id => {
        return db.load(`SELECT teacher.fullname as teachername, `
        + `teacher.id as teacherid, `
        + `teacher.birthday as teacherage, `
        + `teacher.degree as teacherdegree, `
        + `teacher.major as teachermajor, `
        + `teacher.address as teacheraddress, `
        + `teacher.email as teacheremail, `
        + `teacher.avatar as teacheravatar, `
        + `student.id as studentid, `
        + `student.fullname as studentname, `
        + `student.birthday as studentage, `
        + `student.address as studentaddress, `
        + `student.avatar as studentavatar, `
        + `student.email as studentemail, `
        + `contract.id, contract.state, contract.revenue, contract.description, contract.rate, skill.skill,`
        + `DATE_FORMAT(contract.signeddate, '%m/%d/%Y') as signeddate, `
        + `DATE_FORMAT(contract.startdate, '%m/%d/%Y') as startdate, `
        + `DATE_FORMAT(contract.enddate, '%m/%d/%Y') as enddate `
        + `FROM contract, user as teacher, user as student, skill `
        + `WHERE contract.teacherid = teacher.id and contract.studentid = student.id and contract.skillid = skill.id and `
        + `contract.id = ${id}`)
    },

    update: entity => {
        return db.update(`contract`, `id`, entity);
    },

    add: entity => {
        return db.add(`contract`, entity);
    }
}