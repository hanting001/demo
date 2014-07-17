"use strict";
var BizAccept = require('../../models/biz/BizAccept');
var AgentBroker = require('../../models/agent/AgentBroker');
var Provider = require('../../models/product/Provider');
var Product = require('../../models/product/Product');
var PlanRateItem = require('../../models/product/PlanRateItem');
var Contract = require('../../models/biz/Contract');
var Coverage = require('../../models/biz/Coverage');
var Premium = require('../../models/biz/Premium');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');

var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {

    //保单查询页面
    app.get('/biz/contract/contractquery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        var applicationNo = req.query.applicationNo;
        var applicationName= req.query.applicationName;
        var insureName= req.query.insureName;
        var agentName= req.query.agentName;

        var q = null ;

        if(applicationNo != '' && applicationNo !=undefined){
            q = '"applicationNo":"'+applicationNo+'"';
        }


        if(applicationName !=''  && applicationName !=undefined){
            if(q != null){
                q = q +','+ '"applicant.applicantname":"'+applicationName+'"';
            }else{
                q = '"applicant.applicantname":"'+applicationName+'"';
            }
         }

        if(insureName !=''  && insureName !=undefined){
            if(q != null){
                q = q +','+ '"policy.insurename":"'+insureName+'"';
            }else{
                q = '"policy.insurename":"'+insureName+'"';
            }
         }

        if(agentName !='' && agentName !=undefined){
            if(q != null){
                  q = q +','+ '"agentName":"'+agentName+'"';
            }else{
                  q =  '"agentName":"'+agentName+'"';
            }
        }
        if(q===null){
            var qs ={};
        }else{
            var qs =JSON.parse('{' +q+'}');
        }

        //查询1级机构列表
        Contract.paginate(qs,page, 10,function(err, pageCount, contract) {
          //  console.log(contract);
            var  model ={
                title: "新增",
                agentName:agentName,
                insureName:insureName,
                applicationNo:applicationNo,
                applicationName:applicationName,
                contract:contract,
                page : page,
                pageCount : pageCount
            };
            res.render('biz/contract/index', model);
        },{populate:{path:'providerId',select: 'name'}});
    });

    //跳转到录单页面
    app.get('/biz/contract/:id/addContract', function(req, res, next) {
        var  id = req.params.id;    //受理单ID
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        //查询受理单信息
        BizAccept.find({_id:id})
            .populate({
                path:'providerId',
                select: 'type'
            })
            .exec(function(err, Bizaccept){
            var agentid=Bizaccept[0]["agentId"];
            var  model ={
                title: "新增",
                id:Bizaccept[0]["_id"],
                bizaccept:Bizaccept
            };
              console.log(Bizaccept);

            if(Bizaccept[0]["providerId"].type==='1'){
                res.render('biz/contract/add', model);
            }else{
                res.render('biz/contract/basevehicleadd', model);
            }
        });
    });
    // , {columns: 'name code', sortBy : { code : 1 } }


    app.post('/biz/contract/addContract', function(req, res,next) {
        var contract = req.body.contract;//获取页面填写内容
        var userId= new ObjectId("539e68862887d27c2a84ee64");  //默认
        var providerId =new ObjectId(contract.providerId);
            contract.createUserId = userId;
            contract.updateUserId =userId;
            contract.acceptBranchId ='TA_SH';
            contract.agentId = new ObjectId(contract.agentId);
            contract.providerId = providerId;
        var type =contract.providerType;

        if(type === '0'){
            contract.contractStatus ='1';
            contract.businessType ='G';
        }else{
            contract.contractStatus ='0';
            contract.businessType ='L';
        }
        var xz  = req.body.xz; //险种信息
        var productName =xz["Productname"];//险种
        var faceaMout =xz["Faceamout"];//保额
        var fodalPrem =xz["Modalprem"];//保费
        var premiumPeriod =xz["Premiumperiod"];//年期
        var valuePrem =xz["valueprem"];//价保
        var code = new Array();
        //其他费用信息，后续添加......

        var  ageefyRate = new Array();//代理费率
        var  commissionRate = new Array();//佣金率
        var  valueRate = new Array();//价保率
        //其他费率信息，后续添加......

        var faceaMoutTotle =0;//总保额
        var modalPremTotle = 0;//总保费
        var ageefyTotle = 0;//总代理费
        var valuePremTotle =0;//总价保
        var commissionPremTotle =0;//总佣金
        //其他信息
        var  coverages = new Array();//险种
        var  premiums = new Array();//险种
        var  premium = {};
        for(var i= 0;i<productName.length-1;i++){
             code[i] = productName[i].split(":")[0];
        }

        PlanRateItem
        .find({})
        .populate({
            path:'productid',
            match:{productCode:{$in:code}},
            select: 'productCode'
        })
        .exec(function (err, planrateitems) {
            console.log(planrateitems);
                for(var i= 0;i<productName.length-1;i++){
                    for(var j= 0;j<planrateitems.length;j++){
                        var  coverage={};
                        if(productName[i].split(":")[0]===planrateitems[j]['productid'].productCode){
                            ageefyRate      =   planrateitems[j]['AgencyFeeRate'];
                            commissionRate  =   planrateitems[j]['CommissionRate'];
                            valueRate       =   planrateitems[j]['valuepremrate'];

                            ageefyTotle     =   new Number(fodalPrem[i] *  planrateitems[j]['AgencyFeeRate']/100) + ageefyTotle;
                            valuePremTotle  =   new Number(fodalPrem[i] *  planrateitems[j]['valuepremrate']/100) + valuePremTotle;
                            commissionPremTotle =   new Number(fodalPrem[i] *  planrateitems[j]['CommissionRate']/100) + commissionPremTotle;
                            faceaMoutTotle =   new Number(faceaMout[i])+faceaMoutTotle;
                            modalPremTotle =   new Number(fodalPrem[i])+modalPremTotle;

                            coverage.providerId = providerId;
                            coverage.createUserId=userId;
                            coverage.updateUserId=userId;
                            if(type === '0'){
                                coverage.effectiveDate = contract.effectiveDate;
                                coverage.approveDate  = contract.approveDate;
                            }
                            coverage.productId =new ObjectId(planrateitems[j]['productid']._id);
                            coverage.providerid= providerId;
                            coverage.productName =productName[i];
                            coverage.premiumMode = contract.premiumMode;
                            coverage.PremiumPeriod = premiumPeriod[i];
                            coverage.faceaMout =faceaMout[i];
                            coverage.totalModalPrem = fodalPrem[i];
                            coverage.agencyfee =new Number(fodalPrem[i] *  planrateitems[j]['AgencyFeeRate']/100);
                            coverage.valuePrem =new Number(fodalPrem[i] *  planrateitems[j]['valuepremrate']/100);
                            coverage.commisstionPrem=new Number(fodalPrem[i] *  planrateitems[j]['CommissionRate']/100);

                            premium = coverage;
                            premium.policyYear = 1;

                        }
                    }
                    coverages[i] = coverage;
                }
                contract.faceaMoutTotle   =  faceaMoutTotle;
                contract.totalModalPrem   = modalPremTotle;
                contract.agencyfee        = ageefyTotle;
                contract.valuePrem        = valuePremTotle;
                contract.commissionPrem = commissionPremTotle;
                contract.children=coverages;
                var contractModel = new Contract(contract);
                contractModel.save(function(err,contracts){
                    if(err){
                        var model = {
                            contracts : contracts
                        };
                        res.locals.err = err;
                        res.locals.view = 'biz/contract/add';
                        res.locals.model = model;
                        next(); //调用下一个错误处理middlewear
                    }else{
                        for(var k= 0;k<coverages.length;k++){
                            console.log(coverages[k]);
                            coverages[k].policyYear = 1;
                            coverages[k].contractId = new ObjectId(contracts.id);
                            var PremiumModel = new Premium(coverages[k]);
                            PremiumModel.save();
                        }
                        Contract.findById({_id: new ObjectId(contracts.id)}, function(err){
                            if (err){
                                next(err);
                            } else {
                                var ids = req.body.bizaccept.id;//获取页面填写内容
                                BizAccept.update({_id :new ObjectId(ids)},{acceptStatus:'AcceptStatus_B',contractid:new ObjectId(contracts.id)},
                                    { multi: true },function(err){
                                        if (err){
                                            next(err);
                                        }else{
                                            req.flash('showMessage', '创建成功');
                                            res.redirect('/biz/contract/contractquery');
                                        }
                                });
                            }
                        });

                    }

                })
        })
    });

    //保单详细信息
    app.get('/biz/contract/:id/info', function(req, res, next) {
        var  id = req.params.id;    //保单id
        //查询1级机构列表
        Contract
            .find({_id:id})
            .populate({
                path:'providerId',
                select: 'name type'
            })
            .exec(function(err, contracts){
            console.log(contracts);
            var  model ={
                title: "保单明细",
                contract:contracts
            };
            if(contracts[0]['providerId'].type==='1'){
                 res.render('biz/contract/info', model);
            }else{
                res.render('biz/contract/vehicleinfo', model);
            }
        });
    });


    //删除
    app.get('/biz/contract/:id/delete', function(req, res) {
        var  id = req.params.id;
        async.series([
            function(callback){
                Contract.remove({_id:new ObjectId(id)},function(err, results){
                    callback(null,'OK');
                })
            },
            function(callback){
                Premium.remove({contractId:new ObjectId(id)},function(err, results){
                    callback(null,'OK');
                })
            },
            function(callback){
                BizAccept.update({contractid :new ObjectId(id)},{acceptStatus:'AcceptStatus_A'},
                    { multi: true },function(err){
                        if (err){
                            next(err);
                        }else{
                            callback(null,'OK');
                        }
                    });
            }
        ] ,
            function(err, results){
                res.redirect('/biz/contract/contractquery');
            });
    });

    //获取代理人信息
    app.get('/biz/getbrokerinfo', function(req, res) {
        var agentcode = req.query.agentcode ;
        console.log(agentcode);
        Agentbroker.find({"agentCode":agentcode,'agentStatus':'2'},function(err, message){
            console.log(message);
            res.send(message);
        });
    });

    //获取价保
    app.get('/biz/contract/getvalueprem', function(req, res) {
        var Productcode = req.query.Productcode ;
        var providerid = req.query.providerid;
        var Premiumperiod = req.query.Premiumperiod;
        var channeltype = req.query.channeltype;
        var Premiummode = req.query.Premiummode;
        var modalprem = req.query.modalprem;

        //通过providerid+productcode==>productid
        //通过productid+premiumperiod+1+premiumMode ===>费率信息
        Product.find({"productCode":Productcode,"providerId":new ObjectId(providerid)}, function(err, results){
            if(results.length === 0){
                   res.send(results);
            }else{
                PlanRateItem.find({"productid":new ObjectId(results[0]["_id"])},function(err, message){
                   res.send(message);
                });
            }
        })
    });

    //保单承包列表
    app.get('/biz/contract/approvedquery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        var applicationNo = req.query.applicationNo;
        var applicationName= req.query.applicationName;
        var insureName= req.query.insureName;
        var agentName= req.query.agentName;

        var qs = { contractStatus:0,businessType:'L',approveDate:null,contractNo:null} ;

        if(applicationNo != '' && applicationNo !=undefined){
            qs.applicationNo = applicationNo;
        }


        if(applicationName !=''  && applicationName !=undefined){
            qs.applicant.applicantname = applicationName
        }

        if(insureName !=''  && insureName !=undefined){
            qs.policy.insurename =insureName;
        }

        if(agentName !='' && agentName !=undefined){
            qs.agentName = agentName;
        }
        //查询1级机构列表
        Contract.paginate(qs,page, 10,function(err, pageCount, contract) {
            var  model ={
                title: "新增",
                agentName:agentName,
                insureName:insureName,
                applicationNo:applicationNo,
                applicationName:applicationName,
                contract:contract,
                page : page,
                pageCount : pageCount
            };
            res.render('biz/contract/submitquery', model);
        },{populate:{path:'providerId',select: 'name'}});
    });

    //跳转保单承保页面
    app.get('/biz/contract/:id/approved', function(req, res, next) {
        var  id = req.params.id;    //保单id
        //查询1级机构列表
        Contract
            .find({_id:id})
            .populate({
                path:'providerId',
                select: 'name type'
            })
            .exec(function(err, contracts){
                var  model ={
                    title: "保单明细",
                    contract:contracts
                };
                res.render('biz/contract/editinfo', model);
            });
    });

    //保单承保保存
    app.post('/biz/contract/updateContract',function(req, res, next) {
        var contract = req.body.contract;//获取页面填写内容
        console.log(contract);
        Contract.update({_id :new ObjectId(contract.id)},
            {'$set':{'contractStatus':'1','contractNo':contract.contractNo,'paidupDate':contract.paidupDate,'effectiveDate':contract.effectiveDate,'approveDate':contract.approveDate}},
            function(err){
                if(err){
                    next(err);
                }else{
                    res.redirect('/biz/contract/submitquery');
                }
         });

   });

    //保单回执列表
    app.get('/biz/contract/returnquery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        var applicationNo = req.query.applicationNo;
        var applicationName= req.query.applicationName;
        var insureName= req.query.insureName;
        var agentName= req.query.agentName;

        var qs = { contractStatus:1,businessType:'L',signDate:null} ;

        if(applicationNo != '' && applicationNo !=undefined){
            qs.applicationNo = applicationNo;
        }

        if(applicationName !=''  && applicationName !=undefined){
            qs.applicant.applicantname = applicationName
        }

        if(insureName !=''  && insureName !=undefined){
            qs.policy.insurename =insureName;
        }

        if(agentName !='' && agentName !=undefined){
            qs.agentName = agentName;
        }
        //查询1级机构列表
        Contract.paginate(qs,page, 10,function(err, pageCount, contract) {
            var  model ={
                title: "新增",
                agentName:agentName,
                insureName:insureName,
                applicationNo:applicationNo,
                applicationName:applicationName,
                contract:contract,
                page : page,
                pageCount : pageCount
            };
            res.render('biz/contract/returnquery', model);
        },{populate:{path:'providerId',select: 'name'}});
    });


    app.get('/biz/contract/:id/returns', function(req, res, next) {
        var  id = req.params.id;    //保单id
        //查询1级机构列表
        Contract
            .find({_id:id})
            .populate({
                path:'providerId',
                select: 'name type'
            })
            .exec(function(err, contracts){
                var  model ={
                    title: "保单明细",
                    contract:contracts
                };
                res.render('biz/contract/returninfo', model);
            });
    });


    //保单承保保存
    app.post('/biz/contract/updateContractReturn',function(req, res, next) {
        var contract = req.body.contract;//获取页面填写内容
        var hesitateEndDate = moment(contract.signDate, "YYYYMMDD").add('days', 11).calendar();
        Contract.update({_id :new ObjectId(contract.id)},
                        {'$set':{'signDate':contract.signDate,//客户签收日期
                            'returnReceiptAcceptDate':contract.returnReceiptAcceptDate,//交回日期
                            'receiptSubmitDate':contract.receiptSubmitDate,//回执递交日期
                            'returnReceiptDate':contract.signDate,//回执日期
                            'hesitateEndDate':hesitateEndDate} //犹豫期结束日期
                        },
            function(err){
                if(err){
                    next(err);
                }else{
                    res.redirect('/biz/contract/returnquery');
                }

            });

    });

    //判断保单是否存在
    app.get('/biz/contract/checkcontractno', function(req, res) {
        var contractNo = req.query.contractNo ;
        Contract.find({"contractNo":contractNo},"contractNo" ,function(err, message){
            res.send(message);
        });
    });
};
