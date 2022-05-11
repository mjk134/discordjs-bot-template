const { error } = require('../utils/logger');

module.exports = function(modulePath) {
	try {
		return require(modulePath);
	}
	catch (e) {
		error(e);
		process.exit();
	}
};