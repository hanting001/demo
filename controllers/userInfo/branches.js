var Branch = require('../../models/userInfo/Branch');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {
	app.get('/branches', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		
		Branch.paginate({}, page, 10, function(err, pageCount, branches) {
			if (err) {
				return next(err);
			}
			console.log(branches);
			var model = {
					title : '机构列表',
					isAdmin : true,
					branches : branches,
					page : page,
					pageCount : pageCount
				};			
			res.render('userInfo/branches/index', model);
		});
	});

	app.get('/branches/:id/addSub', function(req, res, next) {
		var id = req.params.id;
		Branch.findById(new ObjectId(id), 'abbrName', function(err, branch){
			if (err) {
				return next(err);
			}
			var model = {
					title : '新增机构',
					isAdmin : true,
					parent : {abbrName:branch.abbrName, id:id},
					branchLevel : baseCode.branchLevel(),
					branchTypeLevel : baseCode.branchTypeLevel(),
					branchType:baseCode.branchType()
				};
			res.render('userInfo/branches/addSub', model);	
			
		});
	});
	
	app.post('/branches/:id/addSub', function(req, res, next) {
		var id = req.params.id;
		var branch = req.body.branch;
		branch.parent = new ObjectId(id);
		branch.status = '1';
		//添加其它信息省略
		//...
		
		var branchModel = new Branch(branch);
		branchModel.save(function(err){
			res.locals.err = err;
			next();//调用下一个错误处理middlewear
			var model = {
					branch : branch,
					parent : {id : id, abbrName : req.body.parentAbbr},
					branchLevel : baseCode.branchLevel(),
					branchTypeLevel : baseCode.branchTypeLevel(),
					branchType:baseCode.branchType()
			};
			res.render('userInfo/branches/addSub', model);
		});
	});
};
