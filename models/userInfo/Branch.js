var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var branchSchema = new mongoose.Schema({
	code			:	{ type: String, unique: true, required: true },
	name			:	{ type: String, required: true },
	abbrName		: 	{ type: String, required: true },
	typeId			:	Number,
	parent			:	ObjectId,
	levelId			:	Number,
	typeLevelId		:	Number,
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
	status			:	{type : String, enum : ['0', '1']},
	remarks			:	{type : String, required : true}
}, { collection: 'branches' });




module.exports = mongoose.model('Branch', branchSchema);