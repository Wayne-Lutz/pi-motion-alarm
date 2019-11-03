'use strict';

const alarmRoutes = require('./alarmRoutes');
// const utilRoutes = require('./utilRoutes');

module.exports = function(app) {
	alarmRoutes(app);
	// utilRoutes(app);
};
