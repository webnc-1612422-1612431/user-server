var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/users.model');
var userSkillModel = require('../models/user.skills.model');
var contractModel = require('../models/contracts.model');
var skillModel = require('../models/skills.model');
var commentModel = require('../models/comments.model');

// get profile if exists
router.get('/me', (req, res, next) => {

    if (req.user.length > 0) {
        const user = req.user[0];
        res.status(200).json(user);
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
});

// save avatar
router.post('/avatar', (req, res, next) => {

    var avatar = req.body.avatar;

    if (req.user.length > 0) {
        const user = req.user[0];
        var entity = {
            email: user.email,
            avatar: avatar
        }
        userModel.put(entity).then(rows => {
            res.status(200).json({
                message: 'Cập nhật ảnh đại diện thành công'
            });
        }).catch(err => { console.log(err) });
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
})

// save info
router.post('/update-info', (req, res, next) => {

    var info = req.body.info;

    if (req.user.length > 0) {
        const user = req.user[0];
        var entity = {
            email: user.email,
            address: info.address,
            fullname: info.fullname,
            birthday: info.birthday.substr(0, 10),
            introduction: info.introduction,
            price: parseInt(info.price)
        }
        userModel.put(entity).then(rows => {
            res.status(200).json({
                message: 'Cập nhật thông tin thành công'
            });
        }).catch(err => { console.log(err) });
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
})

// get tags
router.get('/tags', (req, res, next) => {

    if (req.user.length > 0) {

        if (req.user[0].role != 'teacher') {
            return res.status(400).json({
                message: 'Không đủ quyền'
            })
        }

        // get all skill first
        skillModel.all().then(rows => {

            // get skill of user
            userSkillModel.getByUser(req.user[0].id).then(skills => {
                res.status(200).json({
                    suggestions: rows,
                    tags: skills.map(x => {
                        return {
                            id: x.skillid,
                            text: rows.filter(row => (row.id == x.skillid))[0].skill
                        }
                    })
                });

            }).catch(err => { console.log(err) })

        }).catch(err => { console.log(err) })
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
})

// update tags
router.post('/update-tags', (req, res, next) => {

    const skillsid = req.body.skillsid

    if (req.user.length > 0) {

        if (req.user[0].role != 'teacher') {
            return res.status(400).json({
                message: 'Không đủ quyền'
            })
        }

        // delete all
        userSkillModel.removeByUser(req.user[0].id).then(a => {

            // then add again
            for (var i = 0; i < skillsid.length; i++) {
                userSkillModel.add({
                    userid: req.user[0].id,
                    skillid: skillsid[i]
                }).then(r => {
                }).catch(er => {
                    return res.status(400).json({
                        message: 'Đã xảy ra lỗi, vui lòng thử lại'
                    })
                })
            }

            setTimeout(function () {
                return res.status(200).json({
                    message: 'Cập nhật kỹ năng thành công'
                })
            }, 1000)

        }).catch(b => {
            res.status(400).json({
                message: 'Đã xảy ra lỗi, vui lòng thử lại'
            })
        });
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
})

// change password
router.post('/change-pass', (req, res, next) => {

    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const user = req.user[0];

    // compare pass
    if (bcrypt.compareSync(oldPassword, user.password)) {
        var entity = {
            email: user.email,
            lostpasstoken: '',
            password: bcrypt.hashSync(password, 10)
        }
        userModel.put(entity).then(rows => {
            res.status(200).json({
                message: 'Đổi mật khẩu thành công'
            });
        }).catch(err => {
            return res.status(400).json({
                message: 'Đã xảy ra lỗi, vui lòng thử lại'
            });
        });
    }
    else {
        return res.status(400).json({
            message: 'Mật khẩu cũ không chính xác'
        });
    }
})

// get comments
router.post('/get-contracts-comments', (req, res, next) => {

    const teacherid = req.body.teacherid;

    contractModel.getByTeacherId(teacherid).then(contracts => {

        if (contracts.length == 0) {
            contracts = [];
        }

        commentModel.getByTeacherId(teacherid).then(comments => {

            if (comments.length == 0) {
                comments = [];
            }

            return res.status(200).json({
                contracts: contracts,
                comments: comments
            })
    
        }).catch(errr => {
            console.log(errr)
            return res.status(400).json({
                message: 'Đã xảy ra lỗi, xin vui lòng thử lại'
            })
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(400).json({
            message: 'Đã xảy ra lỗi, xin vui lòng thử lại'
        })
    });
})

module.exports = router;