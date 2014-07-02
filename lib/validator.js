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
	//判断邮政编码
	validator.extend('isZipCode', function(str){
		var reg = /[1-9]{1}(\d+){5}/;   
		return reg.test(str);
	});	
	//校验手机号码
	// validator.extend('isMobile', function(str){
	// 	var reg = /^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/;   
	// 	return reg.test(str);
	// });

	return validator;
};

module.exports = extendsFunc();