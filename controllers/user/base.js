var User = require('../../models/system/User');
var UserInfo = require('../../models/UserInfo');
var auth = require('../../lib/auth');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {

    app.get('/user/baseInfo', auth.isAuthenticated('ROLE_USER'), function(req, res, next) {
        var user = req.user;
        var model = {
            showMessage: req.flash('showMessage')
        };
        UserInfo.findOne({
            name: user.name
        }, function(err, userInfo) {
            if (err) {
                return next(err);
            }
            if (userInfo) {
                var user = {};
                for (var o in userInfo) {
                    user[o] = userInfo[o];
                }
                for (var i = 0, l = userInfo.address.length; i < l; i++) {
                    if (userInfo.address[i].type === '默认') {
                        user.address = userInfo.address[i].value;
                        break;
                    }
                }
                model.userInfo = user;
            }
            model.title = '维护用户信息';
            model.user = req.user;
            res.render('user/add', model);
        });
    });

    app.post('/user/baseInfo', auth.isAuthenticated('ROLE_USER'), function(req, res, next) {
        var user = req.body.user;
        var userInfoInput = req.body.userInfo;
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
            UserInfo.findOne({
                name: user.name
            }, function(err, userInfoModel) {
                var address = userInfoInput.province + userInfoInput.city + userInfoInput.county + userInfoInput.town;
                address = address + ' ' + userInfoInput.address;
                userInfoInput.address = [{
                    value: address.trim()
                }];
                userInfoInput.name = user.name;
                if (userInfoModel) {
                    for (var o in userInfoInput) {
                        userInfoModel[o] = userInfoInput[o];
                    }
                } else {
                    userInfoInput.user = user._id
                    userInfoModel = new UserInfo(userInfoInput);
                }
                userInfoModel.save(function(err, userInfo) {
                    if (err) {
                        userInfoInput.address = userInfoInput.address[0].value;
                        var model = {
                            user: user,
                            userInfo: userInfoInput
                        };
                        res.locals.err = err;
                        res.locals.view = 'user/add';
                        res.locals.model = model;
                        return next();
                    }

                    user.userInfo = userInfo._id;
                    user.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        req.flash('showMessage', '提交成功');
                        res.redirect('/user/baseInfo');
                    });
                });
            });
        });
    });
};