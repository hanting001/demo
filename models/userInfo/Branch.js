var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;
var branchSchema = new mongoose.Schema({
	code			:	{type: String, unique: true, required: true },
	name			:	{type: String, required: true },
	abbrName		: 	{type: String, required: true },
	typeId			:	{type : Number, required: true},
	parent			:	{type : ObjectId, required : true},
	levelId			:	{type : Number, required: true},
	typeLevelId		:	{type : Number, required: true},
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
	remarks			:	{type : String, required : true},
	createdAt		: 	{ type: Date, default: Date.now }
}, { collection: 'branches' });


//添加create、update字段
branchSchema.plugin(updatedTimestamp);

//添加自定义校验
branchSchema.pre('save', function (next) {
	var errMsg = {};
	if (!validator.isTeleNO(this.telephone)) {
		//key为页面上输入元素的id,value为错误信息
		errMsg.branchTelephone = '电话号码格式不正确！';
	}
	
	if (errMsg) {
		var err = new Error(JSON.stringify(errMsg));
		next(err);
	} else {
		next();
	}
});

module.exports = mongoose.model('Branch', branchSchema);