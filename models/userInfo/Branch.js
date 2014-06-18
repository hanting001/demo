var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var branchSchema = new mongoose.Schema({
	code			:	{type: String, unique: true, required: true },
	name			:	{type: String, required: true },
	abbrName		: 	{type: String, required: true },
	typeId			:	{type : String, required: true},
	parent			:	{type : ObjectId, required : true},
	levelId			:	{type : String, required: true},
	typeLevelId		:	{type : String, required: true},
	bizScope		:	String,
	establishDate	:	{type : Date, required : true},
	revokeDate		:	Date,
	chief			:	String,
	chiefTele		:	String,
	businesslicence			:	{
		licenceNO			:	String,	/* 业务许可证 */
		licenceDate			:	Date,
		authority			:	String,
		startDate			:	Date,
		endDate				:	Date
	},
	orgLicence	:	{					/* 组织机构证书 */
		orgCode				:	String,
		licenceDate			:	Date,
		orgType				:	String,
		regNO				:	String,
		authority			:	String,
		startDate			:	Date,
		endDate				:	Date		
	},
	nationaltax		:	{
		licenceNO	:	String,
		approvalNO	:	String,
		startDate	:	Date,
		endDate		:	Date
	},
	landtax		:	{
		licenceNO	:	String,
		approvalNO	:	String,
		startDate	:	Date,
		endDate		:	Date
	},
	permit4OpeningAccount : {			/* 开户许可 */
		
	},
	ssInfo			:	{				/* 社保 */
	},
	propertyInfo	:	{				/* 物业信息 */
	},
	telephone		:	{type: String, required: true },
	address			:	{type: String, required: true },
	contactAddr		:	{type: String, required: true },
	zip				:	{type: String, required: true },
	countryCode		:	String,
	districtCode	:	String,
	originalCode	:	String,
	status			:	{type : String, enum : ['0', '1']},
	remarks			:	{type : String},
	createdAt		: 	{ type: Date, default: Date.now }
}, { collection: 'branches' });


//添加create、update字段
branchSchema.plugin(updatedTimestamp);

//添加自定义校验
branchSchema.pre('save', function (next) {
	var errMsg = {};
	var self = this;
	if (!validator.isTeleNO(self.telephone)) {
		//key为页面上输入元素的id,value为错误信息
		errMsg.branchTelephone = '电话号码格式不正确';
	}
	
	if (!validator.isZipCode(self.zip)) {
		errMsg.branchZip = '邮政编码格式不正确';
	}
	
	//var model = this.model(this.constructor.modelName);
	var db = mongoose.connection.db;
	db.collection('branches', function(err, collection){
		if (!err) {
			collection.findOne({_id : self.parent}, function(err, level){
				if (!err) {
					var parentLevel = new Number(level.levelId);
					var currentLevel = new Number(self.levelId);
					if (currentLevel >= parentLevel) {
						errMsg.branchLevel = '所选公司级别不能等于或高于上级机构';
					}
					if ((parentLevel - currentLevel) > 1) {
						errMsg.branchLevel = '所选公司级别不能低于上级机构两级以上';
					}
					if (Object.keys(errMsg).length > 0) {
						var err = new Error(JSON.stringify(errMsg));
						next(err);
					} else {
						console.log(2222);
						next();
					}
				}
			});
		} else {
			console.log(3333);
			next();
		}
	});

	
	//因为判断机构级别是异步方式，所以将调用next也放到find的callback中
//	if (errMsg) {
//		var err = new Error(JSON.stringify(errMsg));
//		next(err);
//	} else {
//		next();
//	}
});

module.exports = mongoose.model('Branch', branchSchema);