var mongoose = require('mongoose'), 
	bcrypt = require('bcrypt'), 
	nconf = require('nconf');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
	name		: {type : String, unique : true, required : true},
	password	: {type : String, unique : true},
	roles		: {type:[String], default:['ROLE_USER']},
	branchCode	: {type:String},
	userType	: {type:String, default:'1'},
	oprBranches	: [String],
	isValid		: {type:String, default:'1'},
	createdAt	: {type: Date, default: Date.now }
});

//添加create、update字段
userSchema.plugin(updatedTimestamp);
//添加唯一字段校验
userSchema.plugin(uniqueValidator, { message: '出错拉, {PATH}不能同已有值重复' });
/**
 * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
 */
userSchema.pre('save', function (next) {
    var user = this;

    //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
    if (!user.isModified('password')) {
        next();
        return;
    }
    if (!this.oprBranches) {
    	this.oprBranches = [this.branchCode];
    }
    //Retrieve the desired difficulty from the configuration. (Default = 8)
    var DIFFICULTY = (nconf.get('bcrypt') && nconf.get('bcrypt').difficulty) || 8;

    //Encrypt it using bCrypt. Using the Sync method instead of Async to keep the code simple.
    var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);

    //Replace the plaintext pw with the Hash+Salted pw;
    user.password = hashedPwd;

    //Continue with the save operation
    next();
});
// checking if password is valid
userSchema.methods.validPassword = function(plainText) {
    return bcrypt.compareSync(plainText, this.password);
};

module.exports = mongoose.model('User', userSchema);