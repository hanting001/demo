var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var branchSchema = new mongoose.Schema({
	code			:	{ type: String, unique: true, required: true },
	name			:	{ type: String, required: true },
	abbrName		: 	{ type: String, required: true },
	type			:	{ type: String, required: true },
	parent			:	ObjectId,
	level			:	{type : String, enum : ['总公司', '分公司', '营业区', '营业部']},
	typeLevel		:	{type : String, enum : ['A级', 'B级', 'C级', '']},
	bizScope		:	String,
	establishDate	:	Date,
	revokeDate		:	Date,
	chief			:	ObjectId,		/* 责任人ID */
	businesslicence			:	{
		licenceNO			:	{ type: String, required: true },	/* 业务许可证 */
		licenceDate			:	Date,
		authority			:	String,
		startDate			:	Date,
		endDate				:	Date
	},
	orgLicence	:	{					/* 组织机构证书 */
		orgCode				:	{ type: String, required: true },
		licenceDate			:	Date,
		orgType				:	String,
		regNO				:	String,
		authority			:	String,
		startDate			:	Date,
		endDate				:	Date		
	},
	nationaltax		:	{
		licenceNO	:	{ type: String, required: true },
		approvalNO	:	String,
		startDate	:	Date,
		endDate		:	Date
	},
	landtax		:	{
		licenceNO	:	{ type: String, required: true },
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
	telephone		:	String,
	address			:	String,
	zip				:	String,
	countryCode		:	String,
	districtCode	:	String,
	originalCode	:	String,
	status			:	{type : String, enum : ['有效', '无效']},
	remarks			:	String
}, { collection: 'branches' });




module.exports = mongoose.model('Branch', branchSchema);