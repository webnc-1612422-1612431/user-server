var express = require('express');
var router = express.Router();
var userModel = require('../models/users.model');
var contractModel = require('../models/contracts.model');
var skillModel = require('../models/skills.model');
var userSkillModel = require('../models/user.skills.model');

// get profile if exists
router.get('/get', (req, res, next) => {

    const email = req.query.email;

    userModel.get(email).then(rows => {
        if (rows.length > 0) {

            // localize degree
            let degree;
            switch (rows[0].degree) {
                case 'university': degree = 'Đại Học'; break;
                case 'master': degree = 'Thạc Sĩ'; break;
                case 'doctor': degree = 'Tiến Sĩ'; break;
                case 'professor': degree = 'Tiến Sĩ'; break;
                default: degree = 'Cao Đẳng';
            }

            // calculate age
            var diff = Date.now() - rows[0].birthday.getTime();

            // get all skill
            skillModel.all().then(skills => {

                // get skill of user
                userSkillModel.getByUser(rows[0].id).then(skillsOfUser => {

                    // localize skill of user
                    const tags = skillsOfUser.map(x => {
                        return {
                            id: x.skillid,
                            text: skills.filter(row => (row.id == x.skillid))[0].skill
                        }
                    })

                    // get number of contract
                    contractModel.countByTeacherId(rows[0].id).then(contracts => {

                        if (contracts.length > 0) {
                            return res.status(200).json({
                                teacherid: rows[0].id,
                                email: rows[0].email,
                                fullname: rows[0].fullname,
                                address: rows[0].address,
                                introduction: rows[0].introduction,
                                avatar: rows[0].avatar,
                                price: abbreviateNumber(rows[0].price),
                                degree: degree,
                                age: Math.floor(diff / 31557600000),
                                countContracts: contracts[0].count,
                                totalRevenue: abbreviateNumber(contracts[0].sum),
                                rate: contracts[0].rate,
                                tags: tags
                            });
                        }

                    }).catch(err => { console.log(err) });

                }).catch(err => { console.log(err) })

            }).catch(err => { console.log(err) })
        }
        else {
            return res.status(400).json({
                message: 'Tài khoản không tồn tại'
            })
        }
    }).catch(err => {
        return res.status(401).json({
            message: 'Đã xảy ra lỗi, xin vui lòng thử lại'
        })
    })
});

// get all teachers
router.get('/all-teacher', (req, res, next) => {

    const major = req.query.major;

    const functionGet = major == 'all' ? userModel.getAllTeachers : userModel.getTeacherByMajor;

    functionGet(major).then(teachers => {
        return res.status(200).json({
            teachers: teachers
        })
    }).catch(err => {
        console.log(err);
    })

})

// get top ten teachers with highest rate
router.get('/highest-rate-teachers', (req, res, next) => {

    const teacherid = req.query.teacherid;

    contractModel.topTenRate().then(teachers => {
        if (teachers.length > 0) {

            // if user want to check
            if (teacherid != undefined) {
                return res.status(200).json({
                    topNumber: teachers.map(x => x.teacherid).indexOf(teacherid) + 1
                })
            }
            else {
                return res.status(200).json({
                    listTopRate: teachers.map(x => x.teacherid)
                })
            }
        }
        else {
            return res.status(200).json({
                topNumber: 0
            })
        }
    }).catch(err => {
        return res.status(400).json({
            message: 'Đã xảy ra lỗi, xin vui lòng thử lại'
        })
    })

})

function abbreviateNumber(number) {
    var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
    var tier = Math.log10(number) / 3 | 0;
    if (tier == 0) return number;
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    return scaled.toFixed(1) + suffix;
}

module.exports = router;