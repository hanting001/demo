module.exports = function () {
    return function (req, res, next) {
    	var err = res.locals.err;
    	console.log(err);
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
    	res.locals.errorMessages = errorMessages;
    	res.locals.showErrorMessage = showErrorMessage;
    };
};