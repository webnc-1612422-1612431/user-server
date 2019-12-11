var db = require('../utils/db');

module.exports = {

    countByTeacherId: teacherid => {
        return db.load(`select count(*) as count, coalesce(sum(coalesce(revenue,0)),0) as sum from contract where teacherid = '${teacherid}'`);
    }
}