/**
 * Created by thinkpad on 14-6-24.
 */

var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var AgentbrokerSchema =new mongoose.Schema({
    agentname   : 	     {type:String,required:true},
    agentcode   :       {type:String,required:true},
    idno         :     {type:String,required:true},
    agentlevel   :     {type:String,required:true},
    contractmobile  : {type:String,required:true},
    agentstatus        :  {type:String,required:true}
},{ collection: 'agentbroker' });

module.exports = mongoose.model('Agentbroker', AgentbrokerSchema);