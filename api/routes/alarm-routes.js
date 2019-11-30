// These are the various HTTP AJAX routes for the server functionality

'use strict';

module.exports = function(app) {
	// Pull in the alarm-controller
	const alarmController = require('../controllers/alarm-controller');

	// The route to set the PIN via an HTTP POST.
	app.route('/api/alarm/setPin')
		.post(alarmController.setPin);

	// The route to determine if the PIN that is POSTed matches the PIN that is currently stored.
	app.route('/api/alarm/matchPin')
		.post(alarmController.matchPin);

	// The route to change the stored PIN with the pin data that is POSTed.
	app.route('/api/alarm/changePin')
		.post(alarmController.changePin);

	// The route to arm (enable) the alarm. The PIN data is posted so that it can be compared with
	// the stored PIN before arming.
	app.route('/api/alarm/arm')
		.post(alarmController.armMotionDetection);

	// The route to disarm (disable) the alarm. The PIN data is posted so that it can be compared with
	// the stored PIN before disarming.
	app.route('/api/alarm/disarm')
		.post(alarmController.disarmMotionDetection);

	// The route to HTTP GET the current alarm stae.
	app.route('/api/alarm/alarmState')
		.get(alarmController.getAlarmState);

	// The route to HTTP GET the picture that was captured when the alarm was triggered.
	app.route('/api/alarm/motionPic')
		.get(alarmController.getMotionPic);
};
