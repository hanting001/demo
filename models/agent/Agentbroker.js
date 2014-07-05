/**
 * Created by thinkpad on 14-6-24.
 */

var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var AgentBrokerSchema =new mongoose.Schema({
    agentName           : 	     {type:String,required:true},
    agentCode            :       {type:String,required:true},
    idNo                 :     {type:String,required:true},
    agentLevel          :     {type:String,required:true},
    contractMobile     : {type:String,required:true},
    agentType           :{type:String,required:true},
    agentStatus        :  {type:String,required:true}
},{ collection: 'agentbroker' });

module.exports = mongoose.model('AgentBroker', AgentBrokerSchema);