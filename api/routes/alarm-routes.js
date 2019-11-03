'use strict';

module.exports = function(app) {
	const alarmController = require('../controllers/alarm-controller');

	app.route('/api/alarm/enterPin')
		.post(alarmController.enterPin);

	app.route('/api/alarm/arm')
		.post(alarmController.armMotionDetection);

	app.route('/api/alarm/disarm')
		.post(alarmController.disarmMotionDetection);

	app.route('/api/alarm/alarmState')
		.get(alarmController.getAlarmState);

	app.route('/api/alarm/motionPic')
		.get(alarmController.getMotionPic);
};
