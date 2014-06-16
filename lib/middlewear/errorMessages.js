module.exports = function () {
    return function (req, res, next) {
    	var err = res.locals.err;
    	var errorMessages = {};
    	if (err.name === 'ValidationError') {
//    		err.errors.forEach(function (e) {
//    			errorMessages.push(e.message);
//    		});
        	var errors = err.errors;
        	for ( var p in errors ){
        		errorMessages[p + ''] = errors[p].message;
        	}
    	}

    	console.log(errorMessages);
    	//res.locals.errorMessages = JSON.stringify(errorMessages);
    	res.locals.errorMessages = errorMessages;
    };
};