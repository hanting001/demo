var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var menuSchema = new mongoose.Schema({
	url				:	{type: String, unique: true, required: true },
	name			:	{type: String, required: true },
	parent			:	{type : String, required : true},/* 直接上级菜单 */
	subs			: 	[String],/* 直接下级机构菜单 */
	levelId			:	{type : String, required: true},
	sortKey			:	{type : Number, default : 0}
}, { collection: 'menus' });


//添加create、update字段
menuSchema.plugin(updatedTimestamp);
//添加唯一字段校验
menuSchema.plugin(uniqueValidator, { message: '出错拉, {PATH}不能同已有值重复' });

//添加自定义校验
menuSchema.pre('save', function (next) {
	var errMsg = {};
	var self = this;
	if (!validator.isTeleNO(self.telephone)) {
		//key为页面上输入元素的id,value为错误信息
		errMsg.branchTelephone = '电话号码格式不正确';
	}
	
	if (!validator.isZipCode(self.zip)) {
		errMsg.branchZip = '邮政编码格式不正确';
	}

	if (errMsg) {
		var err = new Error(JSON.stringify(errMsg));
		next(err);
	} else {
		next();
	}
});

module.exports = mongoose.model('Menu', menuSchema);