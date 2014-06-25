/**
 * Created by thinkpad on 14-6-24.
 */
var mongoose = require("mongoose");
//var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var validator = require('../../lib/validator');
var Error = mongoose.Error;
var ContractSchema =new mongoose.Schema({
createDate :{type:Date},
createuId:{type:ObjectId},
updateDate:{type:Date.now()},
updateuId:{type:ObjectId},
contractno:{type:String},
applicationno:{type:String},
providerid  :{type:String},
channeltype:{type:String},
bizbranchid:{type:String},//业绩归属机构
contractstatus:{type:String},
acceptdate:{type:Date},
applydate:{type:Date},
effectivedate:{type:Date},
approvedate:{type:Date},
agentid:{type:ObjectId},
agentname:{type:String},
premiumMode:{type:String},
PremiumPeriod:{type:String},
totalmodalprem:{type:Number},
initialchargemode:{type:String},
renewalchargemode:{type:String},
agencyfee:{type:Number},
valueprem:{type:Number},
ascriptionMode:{type:String}
},{ collection: 'contracts' });
module.exports = mongoose.model('Contract', ContractSchema);