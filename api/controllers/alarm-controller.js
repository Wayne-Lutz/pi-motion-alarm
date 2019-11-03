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

exports.startMotionDetection = function(req,res) {
	console.log(`alarmController.startMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.startMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		if ( pinData.pin === '1257' ) {
			motionAlarm.start();
			res.sendStatus(HttpStatus.OK);
		} else {
			//res.sendStatus(HttpStatus.UNAUTHORIZED);
			res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
		}
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.stopMotionDetection = function(req,res) {
	console.log(`alarmController.stopMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.stopMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		if ( pinData.pin === '1257' ) {
			motionAlarm.stop();
			res.sendStatus(HttpStatus.OK);
		} else {
			//res.sendStatus(HttpStatus.UNAUTHORIZED);
			res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
		}
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};