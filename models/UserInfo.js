var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('../lib/validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var userInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        unique: true
    },
    mobile: String,
    address: [{
        type: {
            type: String,
            default: '默认'
        },
        value: String
    }],
    userType: {
        type: String,
        default: '1'
    },
    isValid: {
        type: String,
        default: '1'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//添加create、update字段
userInfoSchema.plugin(updatedTimestamp);
//添加唯一字段校验
userInfoSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});

userInfoSchema.virtual('defaultAddress').get(function() {
    var defaultAddress = '';
    for (var i = 0, l = this.address.length; i < l; i++) {
        if (i == 0) {
            defaultAddress = this.address[i].value;
        }
        if (this.address[i].type == '默认') {
            defaultAddress = this.address[i].value;
            break;
        } 
    }
    return defaultAddress;
});
/**
 * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
 */
userInfoSchema.pre('save', function(next) {
    var errMsg = {};
    var self = this;
    if (!validator.isMobile(self.mobile)) {
        errMsg.userInfoMobile = '手机号码格式不正确';
    }
    if (Object.keys(errMsg).length > 0) {
        var err = new Error(JSON.stringify(errMsg));
        next(err);
    } else {
        next();
    }
});


module.exports = mongoose.model('UserInfo', userInfoSchema);