var express = require('express');
var userModel = require('../models/users.model');
var passport = require('passport');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var passport = require('passport');
var config = require('../config.js');
var verifyToken = require('generate-sms-verification-code');
var nodemailer = require('nodemailer');

// request restore password
router.post('/restore-pass', (req, res, next) => {
  var email = req.body.email;
  var code = req.body.token;
  var password = req.body.password;

  if (email === undefined || code === undefined) {
    return res.status(400).json({
      message: 'Đường dẫn phục hồi tài khoản không hợp lệ'
    })
  }
  else {
    userModel.get(email).then(rows => {
      if (rows.length > 0) {
        if (rows[0].lostpasstoken == code) {

          // save new pass to database
          var entity = {
            email: email,
            lostpasstoken: '',
            password: bcrypt.hashSync(password, 10)
          }
          userModel.put(entity).then(rows => { }).catch(err => { console.log(err) });
          return res.status(200).json({
            message: 'Phục hồi mật khẩu thành công'
          })
        }
        else {
          return res.status(400).json({
            message: 'Đường dẫn phục hồi tài khoản không hợp lệ'
          })
        }
      }
      else {
        return res.status(400).json({
          message: 'Đường dẫn phục hồi tài khoản không hợp lệ'
        })
      }
    }).catch(err => {
      if (err) {
        console.log("Error when trying to restore password: ", err);
        return res.status(400).json({
          message: 'Đường dẫn phục hồi tài khoản không hợp lệ'
        })
      }
    });
  }
});

// link restore account password clicked from email
router.get('/forgot-pass', (req, res, next) => {
  var email = req.query.email;
  var code = req.query.token;

  if (email === undefined || code === undefined) {
    return res.redirect(config['client-domain'] + 'login?message=invalid-forgot-pass');
  }
  else {
    userModel.get(email).then(rows => {
      if (rows.length > 0) {
        if (rows[0].lostpasstoken == code) {
          return res.redirect(config['client-domain'] + 'forgot-pass?email=' + email + '&token=' + code);
        }
      }
      return res.redirect(config['client-domain'] + 'login?message=invalid-forgot-pass');
    }).catch(err => {
      if (err) {
        console.log("Error when verifying account: ", err);
        return res.redirect(config['client-domain'] + 'login?message=invalid-forgot-pass');
      }
    });
  }
})

// request sending email for restore pass
router.post('/forgot-pass', (req, res, next) => {
  var email = req.body.email;

  userModel.get(email).then(rows => {
    if (rows.length > 0) {
      var user = rows[0];

      // check verified
      if (user.verified == 0) {
        return res.status(400).json({
          message: 'Tài khoản chưa được kích hoạt'
        })
      }

      // send email to restore pass
      var code = verifyToken(32, { type: 'string' });
      var full_address = req.protocol + '://' + req.headers.host + '/users/forgot-pass?email=' + email + '&token=' + code;
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'tonystrinh@gmail.com',
          pass: 'tqnghia1122'
        }
      });

      // mail content
      var mainOptions = {
        from: 'Uber 4 Tutor',
        to: email,
        subject: '[Uber 4 Tutor] Quên mật khẩu',
        html: '<p>Vui lòng kiểm tra thông tin dưới đây trước khi tiến hành làm mới mật khẩu:</b>' +
          '<ul><li>Họ tên: <b>' + user.fullname +
          '</b></li><li>Tên đăng nhập: <b>' + email +
          '</b></li></ul><p>Nếu thông tin trên là đúng, vui lòng truy cập đường dẫn sau:\n' +
          full_address
      }

      // send mail
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log('Error when sending mail to restore pass: ' + err);
          return res.status(400).json({
            message: 'Đã xảy ra lỗi khi gửi email phục hồi mật khẩu'
          })
        } else {
          console.log('Send email forgot pass to ' + email);
        }
      });

      // save to database
      var entity = {
        email: email,
        lostpasstoken: code
      }
      userModel.put(entity).then(rows => { }).catch(err => { console.log(err) });

      return res.status(200).json({
        message: 'Vui lòng kiểm tra email để phục hồi mật khẩu'
      })
    }
    else {
      return res.status(400).json({
        message: 'Tài khoản không tồn tại'
      })
    }
  })
    .catch(err => {
      if (err) {
        console.log("Error when forgot pass: ", err);
        return res.status(400).json({
          message: 'Đã xảy ra lỗi khi phục hồi mật khẩu'
        })
      }
    });
})

// verify account
router.get('/verify', (req, res, next) => {
  var email = req.query.email;
  var code = req.query.token;

  if (email === undefined || code === undefined) {
    return res.redirect(config['client-domain'] + 'login?message=invalid-verified');
  }
  else {
    userModel.get(email).then(rows => {
      if (rows.length > 0) {
        if (rows[0].lostpasstoken == code) {

          // save to database
          var entity = {
            email: email,
            lostpasstoken: '',
            verified: 1
          }
          userModel.put(entity).then(rows => { }).catch(err => { console.log(err) });

          return res.redirect(config['client-domain'] + 'login?message=verified');
        }
      }
      return res.redirect(config['client-domain'] + 'login?message=invalid-verified');
    }).catch(err => {
      if (err) {
        console.log("Error when verifying account: ", err);
        return res.redirect(config['client-domain'] + 'login?message=invalid-verified');
      }
    });
  }
})

// register a new user
router.post('/sign-up', (req, res, next) => {

  var email = req.body.email;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var address = req.body.address;
  var role = req.body.role;
  var major = req.body.major;
  var birthday = req.body.birthday;
  var degree = req.body.degree;

  // check params
  if (!email || !password || !address || !fullname) {
    res.status(400).json({
      message: 'Vui lòng nhập đầy đủ thông tin'
    });
  }
  else {

    // hash password
    var saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);
    var code = verifyToken(32, { type: 'string' });

    // create an entity
    var entity = {
      email: email,
      password: hash,
      address: address,
      fullname: fullname,
      major: major,
      birthday: birthday,
      degree: degree,
      role: role,
      lostpasstoken: code,
      verified: 0
    }

    // send email to verify
    var full_address = req.protocol + '://' + req.headers.host + '/users/verify?email=' + email + '&token=' + code;
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tonystrinh@gmail.com',
        pass: 'tqnghia1122'
      }
    });

    // mail content
    var mainOptions = {
      from: 'Uber 4 Tutor',
      to: email,
      subject: '[Uber 4 Tutor] Xác nhận tài khoản',
      html: '<p>Vui lòng kiểm tra thông tin dưới đây trước khi tiến hành xác nhận tài khoản:</b>' +
        '<ul><li>Họ tên: <b>' + fullname +
        '</b></li><li>Tên đăng nhập: <b>' + email +
        '</b></li></ul><p>Nếu thông tin trên là đúng, vui lòng truy cập đường dẫn sau:\n' +
        full_address
    }

    // send mail
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log('Error when sending mail to verify: ' + err);
        res.redirect(config['client-domain'] + 'login');
      } else {
        console.log('Send email verify to ' + email);
      }
    });

    // add to database
    userModel.add(entity).then(id => {
      res.status(200).json({
        message: 'Đăng ký tài khoản thành công'
      })
    }).catch(err => {
      var errMessage = err.code;
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          errMessage = 'Đã tồn tại tài khoản với email này';
          break;
      }
      res.status(400).json({
        message: errMessage
      });
    })
  }
});

// login with username & password
router.post('/login', (req, res, next) => {

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({
        message: info.message,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json({
          message: err
        });
      }

      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(JSON.stringify(user), 'nghiatq_jwt_secretkey');
      return res.json({
        user,
        token
      });
    });
  })(req, res);
});

// facebook login
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/login/facebook/callback', passport.authenticate('facebook', {
  session: false,
  failureRedirect: config['client-domain'] + 'login/',
}), (req, res) => {

  // case not verified
  if (req.user && req.user.message) {
    res.redirect(config['client-domain'] + 'login?message=' + req.user.message);
  }

  // case sign-up
  else if (req.user && req.user.fullname) {
    res.redirect(config['client-domain'] + 'sign-up-social?fullname=' + req.user.fullname + '&email=' + req.user.email);
  }

  // case login
  else {
    const token = jwt.sign(JSON.stringify(req.user), 'nghiatq_jwt_secretkey');
    res.redirect(config['client-domain'] + 'login?token=' + token + '#nghiatq');
  }
});

// google login
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: config['client-domain'] + 'login/',
}), (req, res) => {

  // case not verified
  if (req.user && req.user.message) {
    res.redirect(config['client-domain'] + 'login?message=' + req.user.message);
  }

  // case sign-up
  else if (req.user && req.user.fullname) {
    res.redirect(config['client-domain'] + 'sign-up-social?fullname=' + req.user.fullname + '&email=' + req.user.email);
  }

  // case login
  else {
    const token = jwt.sign(JSON.stringify(req.user), 'nghiatq_jwt_secretkey');
    res.redirect(config['client-domain'] + 'login?token=' + token + '#nghiatq');
  }
});

// register a new user
router.post('/changeinfo', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  var username = req.body.username;
  var oldPassword = req.body.oldPassword;
  var password = req.body.password;
  var email = req.body.email;
  var fullname = req.body.fullname;

  // check params
  if (!username || !email || !fullname) {
    res.status(400).json({
      message: 'Vui lòng nhập đầy đủ thông tin'
    });
  }
  else {
    userModel.get(username).then(rows => {
      if (rows.length === 0) {
        return res.status(400).json({
          message: 'Tài khoản không tồn tại'
        });
      }
      var user = rows[0];

      // update basic info
      var entity = {
        username: username,
        email: email,
        fullname: fullname
      }

      // update password
      if (oldPassword || password) {

        // compare password
        var ret = bcrypt.compareSync(oldPassword, user.password);
        if (!ret) {
          return res.status(400).json({
            message: 'Mật khẩu cũ không chính xác'
          });
        }
        else {
          var saltRounds = 10;
          var hash = bcrypt.hashSync(password, saltRounds);
          entity.password = hash;
        }
      }

      // write to database
      userModel.put(entity).then(id => {
        return res.status(200).json({
          message: 'Cập nhật thông tin thành công'
        });
      }).catch(err => {
        return res.status(400).json({
          message: 'Đã xảy ra lỗi, vui lòng thử lại'
        });
      })

    }).catch(err => {
      return res.status(400).json({
        message: 'Đã xảy ra lỗi, vui lòng thử lại'
      });
    })
  }
});

module.exports = router;