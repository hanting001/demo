"use strict";
var BizAccept = require('../../models/biz/BizAccept');
var AgentBroker = require('../../models/agent/AgentBroker');
var Provider = require('../../models/product/Provider');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {

    //列表
    app.get('/biz/bizaccept/bizacceptquery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        //查询1级机构列表
        BizAccept.paginate({acceptStatus:'AcceptStatus_A'}, page, 10, function(err, pageCount, Bizaccepts) {
            if (err) {
                return next(err);
            }
            var model = {
                title : '受理清單',
                isAdmin : true,
                Bizaccepts : Bizaccepts,
                page : page,
                pageCount : pageCount,
                showMessage : req.flash('showMessage')
            };
            res.render('biz/bizaccept/index', model);
        });
    });

    //新增
    app.get('/biz/bizaccept/addBizaccept', function(req, res, next) {
        BizAccept.find({},function(err, Bizaccept){
            var  model ={
                title: "新增",
                Bizaccept : Bizaccept
            };
            res.render('biz/bizaccept/add', model);
        });
    });

    //保存新增信息
    app.post('/biz/bizaccept/addBizaccept', function(req, res,next) {
        var bizaccept = req.body.bizaccept;//获取页面填写内容
        var providercode =bizaccept.providerCode.split(":")[0];
        var uid= new ObjectId("539e68862887d27c2a84ee64");  //默认
            bizaccept.createUserId = uid;
            bizaccept.updateUserId =uid;
            bizaccept.acceptUserId =uid;
            bizaccept.acceptBranchId ='TA_SH';
            bizaccept.agentId = new ObjectId(bizaccept.agentId);
            Provider.find({"code":providercode}, function(err, results){
                var ids=results[0]["_id"];
                    bizaccept.providerId = new ObjectId(ids);
                var bizacceptModel = new BizAccept(bizaccept);
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
                        BizAccept.findById({_id: new ObjectId(bizaccepts.id)}, function(err){
                            if (err){
                                next(err);
                            } else {
                                req.flash('showMessage', '创建成功');
                                res.redirect('/biz/bizaccept/bizacceptquery');
                            }
                        });
                    }
                });
            });
    });

    //删除
    app.get('/biz/bizaccept/:id/delete', function(req, res) {
        var  id = req.params.id;
        BizAccept.remove({_id : new ObjectId(id)},function (err){
            if (err) {
                return next(err);
            }
        });
        res.redirect('/biz/bizaccept/bizacceptquery');
    });

    //获取代理人信息
    app.get('/biz/getbrokerinfo', function(req, res) {
        var agentcode = req.query.agentcode ;
        AgentBroker.find({"agentCode":agentcode,'agentStatus':'2'},function(err, message){
            res.send(message);
        });
    });

    //判断投保单是否存在
    app.get('/biz/bizaccept/checkapplicationno', function(req, res) {
        var applicationNo = req.query.applicationNo ;
        BizAccept.find({"applicationNo":applicationNo},"applicationNo" ,function(err, message){
            res.send(message);
        });
    });



};
