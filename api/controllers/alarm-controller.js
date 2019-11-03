'use strict';

const HttpStatus = require('http-status-codes');
const motionAlarm = require('../../lib/motion-alarm');

exports.enterPin = function(req,res) {
	console.log(`alarmController.enterPin() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.enterPin, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		if ( pinData.pin === '1257' ) {
			res.sendStatus(HttpStatus.OK);
		} else {
			//res.sendStatus(HttpStatus.UNAUTHORIZED);
			res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
		}
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.armMotionDetection = function(req, res) {
	console.log(`alarmController.startMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.startMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		if ( pinData.pin === '1257' ) {
			motionAlarm.arm();
			res.sendStatus(HttpStatus.OK);
		} else {
			//res.sendStatus(HttpStatus.UNAUTHORIZED);
			res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
		}
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.disarmMotionDetection = function(req, res) {
	console.log(`alarmController.stopMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.stopMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		if ( pinData.pin === '1257' ) {
			motionAlarm.disarm();
			res.sendStatus(HttpStatus.OK);
		} else {
			//res.sendStatus(HttpStatus.UNAUTHORIZED);
			res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
		}
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.getAlarmState = function(req, res) {
	// console.log(`alarmController.getAlarmState() ENTERED`);

	motionAlarm.alarmState.then((value) => {
		// console.log('getAlarmState(), value= ' + value);
		res.status(HttpStatus.OK).send(value);
	});
};

exports.getMotionPic = function(req, res) {
	// console.log(`alarmController.getMotionPic() ENTERED`);

	motionAlarm.motionPic.then((value) => {
		// console.log('getMotionPic(), value= ' + value);
		// console.log(typeof value);
		// console.log(JSON.stringify(value));
		if ( value ) {
			// res.status(HttpStatus.OK).write(new Buffer(value));
			res.writeHead(HttpStatus.OK, {"Content-Type": "image/jpeg"});
			res.write(new Buffer(value));
		} else
			res.status(HttpStatus.NOT_FOUND).send("Not found.");
	});
};
