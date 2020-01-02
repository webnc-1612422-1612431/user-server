var db = require('../utils/db');

module.exports = {

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
    }
}