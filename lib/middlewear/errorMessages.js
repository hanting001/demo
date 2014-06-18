module.exports = function () {
    return function (req, res, next) {
    	//console.log(res.locals.err);
		var url = res.locals.url;
		var model = res.locals.model;
    	var err = res.locals.err;
    	var errorMessages = {};
    	var showErrorMessage = [];
    	if (err.name === 'ValidationError') {
        	var errors = err.errors;
        	for ( var p in errors ){
        		errorMessages[p + ''] = errors[p].message;
        	}
    	} else if (err.name === 'MongooseError') {
    		errorMessages = JSON.parse(err.message);
    	}

    	for (var p in errorMessages) {
    		showErrorMessage.push(errorMessages[p]);
    	}
    	if (err) {
        	res.locals.errorMessages = errorMessages;
        	res.locals.showErrorMessage = showErrorMessage;
        	res.render(url, model);
    	} else {
    		next();
    	}

    };
};