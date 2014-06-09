var Branch = require('../../models/userInfo/Branch');


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
			// console.log('pageCount:%s', pageCount);
			console.log(branches[0]);
			var model = {
					title : '机构列表',
					branches : branches,
					page : page,
					pageCount : pageCount
				};			
			res.render('userInfo/branches/index', model);
		});
	});
};
