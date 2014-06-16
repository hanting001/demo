/**
 * New node file
 */
var validator = require('validator');

var extendsFunc = function() {
	//判断是否为电话号码
	validator.extend('isTeleNO', function(str){
		var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;   
		return reg.test(str);
	});
	
	return validator;
};

module.exports = extendsFunc();