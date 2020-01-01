var db = require('../utils/db');

module.exports = {

    countByTeacherId: teacherid => {
        return db.load(`select count(*) as count, coalesce(sum(coalesce(revenue,0)),0) as sum, avg(rate) as rate from contract where teacherid = '${teacherid}'`);
    },

    topTenRate: () => {
        return db.load(`SELECT teacherid, count(*) as count, avg(rate) as rate FROM contract group by teacherid order by rate desc`);
    },

    topTenContractNumbers: () => {
        return db.load(`SELECT teacherid, count(*) as count, avg(rate) as rate FROM contract group by teacherid order by count desc`);
    }
}