'use strict';

module.exports = function(app) {
	const alarmController = require('../controllers/alarm-controller');

	app.route('/api/alarm/enterPin')
		.post(alarmController.enterPin);

	app.route('/api/alarm/start')
		.post(alarmController.startMotionDetection);

	app.route('/api/alarm/stop')
		.post(alarmController.stopMotionDetection);
};