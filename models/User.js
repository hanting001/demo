var mongoose = require('mongoose'), 
	bcrypt = require('bcrypt'), 
	nconf = require('nconf');

var userSchema = new mongoose.Schema({
	name : {
		type : String,
		unique : true
	},
	password : String,
	role : String
});

// methods ======================
// generating a hash
//userSchema.methods.generateHash = function(password) {
//	return md5(password);
//};
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