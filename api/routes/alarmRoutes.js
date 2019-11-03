'use strict';

module.exports = function(app) {
	const alarmController = require('../controllers/alarmController');

	app.route('/api/alarm/enterPin')
		.post(alarmController.enterPin);
};