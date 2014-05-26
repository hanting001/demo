var http = require('http');

module.exports = function(app) {
	app.get('/books', function(req, res, next) {
		var options = {
			host : 'localhost',
			port : 8080,
			path : '/apis/books?format=json',
			method : 'GET',
			headers : {
				'accept' : '*/*',
				'content-type' : "application/json"
			}
		};
		var books = '';
		var req = http.request(options, function(response) {
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				books = books + chunk;
			});
			response.on('end', function () {
	            //console.log(books);
	            var model = {
	            	title : '书目',
	            	books : JSON.parse(books)
	            };
	            res.render('books/index', model);  
	        });
		});

		// write data to request body
		req.end();
	});
};