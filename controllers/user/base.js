var User = require('../../models/system/User');
var UserInfo = require('../../models/UserInfo');
var menuHelper = require('../../lib/menuHelper');
var auth = require('../../lib/auth');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {

    app.get('/user/base', auth.isAuthenticated('ROLE_USER'), function(req, res, next) {
        var user = req.user;
        var model = {
            showMessage: req.flash('showMessage')
        };
        model.user = user;
        model.title = '维护用户信息';
        res.render('userInfo/add', model);
    });

    app.post('/user/base', auth.isAuthenticated('ROLE_USER'), function(req, res, next) {
        var user = req.body.user;
        var userInfo = req.body.userInfo;
        User.findOneAndUpdate({
            name: user.name
        }, {
            $set: {
                fullName: user.fullName
            }
        }, function(err, user) {
            if (err) {
                return next(err);
            }
            var userInfoModel = new UserInfo(userInfo);
            userInfoModel.name = user.name;
            userInfoModel.save(function(err, userInfo) {
                if (err) {
                    var model = {
                        user: user,
                        userInfo: userInfo
                    };
                    res.locals.err = err;
                    res.locals.view = 'userInfo/add';
                    res.locals.model = model;
                    console.log(err);
                    return next();
                }
                console.log('创建成功');
                req.flash('showMessage', '创建成功');
                res.redirect('/user/base');
            });
        });
    });
}