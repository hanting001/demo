var Branch = require('../../models/userInfo/Branch');
var BranchCounter = require('../../models/userInfo/BranchCounter');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {
	app.get('/branches', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var parent = '';
		if (req.query.parent) {
			parent = req.query.parent;
		}
		//查询各个总公司
		Branch.paginate({parent:parent}, page, 10, function(err, pageCount, branches) {
			if (err) {
				return next(err);
			}
			var model = {
					title : '机构列表',
					isAdmin : true,
					branches : branches,
					page : page,
					pageCount : pageCount,
					showMessage : req.flash('showMessage')
				};
			res.render('userInfo/branches/index', model);
		}, { sortBy : { code : 1 } });
	});

	app.get('/branches/:parentId/addSub', function(req, res, next) {
		var parentId = req.params.parentId;
		Branch.findById(new ObjectId(parentId), 'name code levelId', function(err, parent){
			if (err) {
				return next(err);
			}
			var model = {
					title : '新增机构',
					isAdmin : true,
					branch  : {levelId : (new Number(parent.levelId) + 1).toString()},
					parent : {abbrName:parent.name + '-' + parent.code, code:parent.code, id:parent.id}
				};
			res.render('userInfo/branches/addSub', model);						
		});
	});
	
	app.post('/branches/:parentId/addSub', function(req, res, next) {
		var parentId = req.params.parentId;
		var parent = req.body.parent;
		parent.id = parentId;
		var branchInput = req.body.branch;
		branchInput.parent = parent.code;
		branchInput.status = '1';
		//添加其它信息省略
		//...
		BranchCounter.getNextSeq(parent.code, branchInput.levelId, function(err, nextSeq){
			if (err) {
				next(err);
			} else {
				branchInput.code = parent.code + nextSeq;
				var branchModel = new Branch(branchInput);
				branchModel.save(function(err, branch){
					if(err) {
						var model = {
								branch : branchInput,
								parent : parent
						};
						res.locals.err = err;
						res.locals.view = 'userInfo/branches/addSub';
						res.locals.model = model;
						next();//调用下一个错误处理middlewear
					} else {
						Branch.findByIdAndUpdate(new ObjectId(parentId), {$push:{subs:branch.code}}, function(err){
							if (err){
								next(err);
							} else {
								req.flash('showMessage', '创建成功');
								res.redirect('/branches/'+parentId +'/down');
							}
						});
					}
				});				
			}
		});
	});
	
	app.get('/branches/:id/edit', function(req, res, next) {
		var id = req.params.id;
		Branch.findById(new ObjectId(id), function(err, branch) {
			if (err) {
				return next(err);
			}
			Branch.findOne({code:branch.parent}, 'abbrName code', function(err, parent){
				console.log(parent);
				var model = {
					title : '编辑机构信息',
					isAdmin : true,
					branch : branch,
					parent : parent,
					showMessage : req.flash('showMessage')
				};			
				res.render('userInfo/branches/edit', model);
			});
		});
	});
	app.post('/branches/:id/edit', function(req, res, next) {
		var id = req.params.id;
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (!err) {
				var newBranch = req.body.branch;
				for (var o in newBranch) {
						branch[o] = newBranch[o];
				}
				branch.save(function(err, branch){
					if(err) {
						newBranch.id = id;
						var model = {
								branch : newBranch,
								parent : {id : req.body.parentId, abbrName : req.body.parentAbbr}
						};
						res.locals.err = err;
						res.locals.view = 'userInfo/branches/edit';
						res.locals.model = model;
						next();//调用下一个错误处理middlewear
					} else {
						req.flash('showMessage', '修改成功');
						res.redirect('/branches/' + branch.id + '/edit');
					}					
				});					
			}			
		});
	});
	app.get('/branches/:id/down', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (err){
				next(err)
			} else {
				var condition = {};
				condition.parent = branch.code;
				condition.levelId = (new Number(branch.levelId) + 1).toString();
				Branch.paginate(condition, page, 10, function(err, pageCount, branches){
					var model = {
							title : '机构列表',
							isAdmin : true,
							branches : branches,
							page : page,
							pageCount : pageCount,
							showMessage : req.flash('showMessage')
						};			
					res.render('userInfo/branches/index', model);
				}, { sortBy : { code : 1 } });					
			}			
		});
	});
	app.get('/branches/:id/up', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (err){
				next(err)
			} else {
				var condition = {};
				condition.code = branch.parent;
				Branch.paginate(condition, page, 10, function(err, pageCount, branches){
					var model = {
							title : '机构列表',
							isAdmin : true,
							branches : branches,
							page : page,
							pageCount : pageCount,
							showMessage : req.flash('showMessage')
						};			
					res.render('userInfo/branches/index', model);
				}, { sortBy : { code : 1 } });					
			}			
		});
	});
	
	app.get('/branches/return', function(req, res, next){
		console.log(11111111111111);
		var id = req.query.id;
		console.log(id);
		Branch.findById(new ObjectId(id), 'parent', function(err, branch) {
			if (err) {
				return next(err);
			}
			res.redirect('/branches?parent=' + branch.parent);
		});
	});
};
