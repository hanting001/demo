/**
 * Created by thinkpad on 14-6-23.
 */
var mongoose = require("mongoose");
//var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var validator = require('../../lib/validator');
var Error = mongoose.Error;
var BizacceptSchema =new mongoose.Schema({
    createdAt   : 	     {type:Date, default: Date.now  },
    createuId   :       {type:ObjectId ,required:true},
    updatedAt   :       {type:Date, default: Date.now },
    updateuId   :       {type:ObjectId ,required:true},
    acceptbranchId  :   {type:String,required:true},
    acceptuId        :  {type:ObjectId ,required:true},
    acceptdAd        :  { type: Date, default: Date.now },
    acceptStatus    :   {type:String,default:'AcceptStatus_A'},
    agentidNo   :   {type:String},
    customeridNo    :  {type:String},
    providerCode    :  {type:String},
    providerId   :  {type:ObjectId},
    acceptNum   :{type:Number},
    agentId     :{type:ObjectId},
    agentname    :{type:String},
    applicationno :{type:String,required:true}
},{ collection: 'bizaccepts' });

BizacceptSchema.pre('save', function (next) {
    var errMsg = {};
    var self = this;

    if (!validator.IsIdCardNo(self.agentidNo)) {
        //key为页面上输入元素的id,value为错误信息
        errMsg.agentidNo = '代理人身份证格式不正确';
    };

    if (!validator.IsIdCardNo(self.customeridNo)) {
        errMsg.customeridNo = '客户身份证格式不正确';
    };

    console.log(self.acceptNum+'----------'+validator.IsMoney(self.acceptNum));

    if (!validator.IsMoney(self.acceptNum)) {
        errMsg.acceptNum = '保费格式不争取，最多有两位小数';
    };

    if (Object.keys(errMsg).length > 0) {
        var err = new Error(JSON.stringify(errMsg));
        next(err);
    } else {
        next();
    }
});
module.exports = mongoose.model('Bizaccept', BizacceptSchema);