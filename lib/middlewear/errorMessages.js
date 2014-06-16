module.exports = function () {
    return function (req, res, next) {
    	var err = res.locals.err;
    	var errorMessages = {};
    	if (err.name === 'ValidationError') {
        	var errors = err.errors;
        	for ( var p in errors ){
        		errorMessages[p + ''] = errors[p].message;
        	}
    	}

    	console.log(errorMessages);
    	res.locals.errorMessages = errorMessages;
    };
};