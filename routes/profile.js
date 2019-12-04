var express = require('express');
var router = express.Router();

// get profile if exists
router.get('/me', (req, res, next) => {
    
    if (req.user.length > 0) {
        const user = req.user[0];
        const info = {
            email: user.email,
            fullname: user.fullname,
            role: user.role,
            avatar: user.avatar
        }
        res.status(200).json(info);
    }
    else {
        res.status(400).json({
            message: 'Đã xảy ra lỗi, vui lòng thử lại'
        })
    }
});

module.exports = router;