var mongoose = require('mongoose');
var baseCode = require('../../lib/baseCode');
var ObjectId = mongoose.Schema.Types.ObjectId;
var branchSchema = new mongoose.Schema({
	code			:	{ type: String, unique: true, required: true },
	name			:	{ type: String, required: true },
	abbrName		: 	{ type: String, required: true },
	type			:	{ type: String, required: true,  enum : baseCode.branchType},
	parent			:	ObjectId,
	level			:	{type : String, enum : baseCode.branchLevel},
	typeLevel		:	{type : String, enum : baseCode.branchTypeLevel},
	bizScope		:	String,
	establishDate	:	Date,
	revokeDate		:	Date,
	chief			:	String,
	chiefTele		:	String,
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
	address			:	{type : String, required: true},
	contactAddr		:	{type : String, required: true},
	zip				:	String,
	countryCode		:	String,
	districtCode	:	String,
	originalCode	:	String,
	status			:	{type : String, enum : ['有效', '无效']},
	remarks			:	String
}, { collection: 'branches' });




module.exports = mongoose.model('Branch', branchSchema);