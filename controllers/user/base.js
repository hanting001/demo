var User = require('../../models/system/User');
var UserInfo = require('../../models/UserInfo');
var menuHelper = require('../../lib/menuHelper');
var auth = require('../../lib/auth');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {

    app.get('/userbase',  function(req, res, next) {
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
                        console.log(userInfo.address[i].value);
                        user.address = userInfo.address[i].value;
                        break;
                    }
                }
                model.userInfo = user;
            }
            model.title = '维护用户信息';
            console.log(model);
            res.render('userInfo/add', model);
        });

    });

    app.post('/userbase',  function(req, res, next) {
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
                    value: address
                }];
                userInfoInput.name = user.name;

                for (var o in userInfoInput) {
                    userInfoModel[0] = userInfoInput[0];
                }
                userInfoModel.save(function(err, userInfo) {
                    if (err) {
                        var model = {
                            user: user,
                            userInfo: userInfoInput
                        };
                        res.locals.err = err;
                        res.locals.view = 'userInfo/add';
                        res.locals.model = model;
                        return next();
                    }
                    req.flash('showMessage', '创建成功');
                    res.redirect('/userbase');
                });
            });
        });
  
    });
}