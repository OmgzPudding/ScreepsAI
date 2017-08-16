var master = require('master');

module.exports.loop = function() {
	master.prepare();
	master.execute();
}