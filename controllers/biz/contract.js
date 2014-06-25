/**
 * Created by thinkpad on 14-6-24.
 */
var Bizaccept = require('../../models/biz/Bizaccept');
var Agentbroker = require('../../models/agent/Agentbroker');
var Provider = require('../../models/product/Provider');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {

    //跳转到录单页面
    app.get('/contract/:id/addContract', function(req, res, next) {
        var  id = req.params.id;    //受理单ID
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        //查询1级机构列表
        Bizaccept.find({_id:id},function(err, Bizaccept){
            console.log(Bizaccept);
            var agentid=Bizaccept[0]["agentId"];
            Agentbroker.find({_id:new ObjectId(agentid)},function(err, agentbrokers){
                console.log(agentbrokers);
            });
            Provider.find({_id:new ObjectId(agentid)},function(err, provider){
                console.log(provider);
            });
            var  model ={
                title: "新增",
                bizaccept:Bizaccept,
                chargemode :baseCode.chargemode(),//缴费方式
                premiumpreiod :baseCode.premiumpreiod(),//缴别
                idtype:baseCode.idtype()//证件类型
            };
            res.render('biz/contract/add', model);
        });
    });

    // , {columns: 'name code', sortBy : { code : 1 } }

    //新增
    app.get('/biz/add', function(req, res, next) {
        Bizaccept.find({},function(err, Bizaccept){
            var  model ={
                title: "新增",
                Bizaccept : Bizaccept
            };
            res.render('biz/bizaccept/add', model);
        });
    });

    //保存新增信息
    app.post('/biz/add', function(req, res,next) {
        var bizaccept = req.body.bizaccept;//获取页面填写内容
        bizaccept.providerCode = bizaccept.providerCode.split(":")[0];
        var uid= new ObjectId("539e68862887d27c2a84ee64");  //默认
        bizaccept.createuId = uid;
        bizaccept.updateuId =uid;
        bizaccept.acceptuId =uid;
        bizaccept.acceptbranchId ='TA_SH';
        bizaccept.agentId = new ObjectId(bizaccept.agentId);
        var bizacceptModel = new Bizaccept(bizaccept);
        bizacceptModel.save(function(err,bizaccepts){
            if(err){
                var model = {
                    bizaccept : bizaccept
                };
                res.locals.err = err;
                res.locals.view = 'biz/bizaccept/add';
                res.locals.model = model;
                next(); //调用下一个错误处理middlewear
            }else{
                Bizaccept.findById({_id: new ObjectId(bizaccepts.id)}, function(err){
                    if (err){
                        next(err);
                    } else {
                        req.flash('showMessage', '创建成功');
                        res.redirect('/bizaccept');
                    }
                });
            }
        });
    });

    //删除
    app.get('/biz/:id/delete', function(req, res) {
        var  id = req.params.id;
        Bizaccept.remove({_id : new ObjectId(id)},function (err){
            if (err) {
                return next(err);
            }
        });
        res.redirect('/bizaccept');
    });

    //获取代理人信息
    app.get('/biz/getbrokerinfo', function(req, res) {
        var agentcode = req.query.agentcode ;
        console.log(agentcode);
        Agentbroker.find({"agentcode":agentcode,'agentstatus':'2'},function(err, message){
            console.log(message);
            res.send(message);
        });
    });


};
