var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var menuSchema = new mongoose.Schema({
	url				:	{type: String, required: true },
	fullUrl			:	{type: String, unique: true, required: true },
	name			:	{type: String, required: true },
	parent			:	{type : String, required : true},/* 直接上级菜单 */
	subs			: 	[String],/* 直接下级机构菜单 */
	levelId			:	{type : String, required: true},
	sortKey			:	{type : Number, default : 0},
	createdAt		: 	{ type: Date, default: Date.now }
}, { collection: 'menus' });



//添加create、update字段
menuSchema.plugin(updatedTimestamp);
//添加唯一字段校验
menuSchema.plugin(uniqueValidator, { message: '出错拉, {PATH}不能同已有值重复' });

//添加自定义校验
menuSchema.pre('save', function (next) {
	var errMsg = {};
	var self = this;
	var reg = /(^\/)(\w|\d)+$/;
	if (self.url.indexOf('/') != 0) {
		self.url = '/' + self.url;
	}
	if (self.fullUrl.indexOf('/') != 0) {
		self.fullUrl = '/' + self.fullUrl;
	}
	if (Object.keys(errMsg).length > 0) {
		var err = new Error(JSON.stringify(errMsg));
		next(err);
	} else {
		next();
	}
});

module.exports = mongoose.model('Menu', menuSchema);