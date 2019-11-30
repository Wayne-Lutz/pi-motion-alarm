// This is the express HTTP alarm-controller for the server side node app.

'use strict';

// Pull in the 3rd party http-status-codes module for use.
const HttpStatus = require('http-status-codes');
// Pull in our motion-alarm module which we wrote.
const motionAlarm = require('../../lib/motion-alarm');

// The function that is called to set the PIN
exports.setPin = function(req,res) {
	console.log(`alarmController.setPin() ENTERED`);

	// Get the pin from the request body
	const pinData = req.body;
	console.log(`alarmController.setPin, pinData= ${JSON.stringify(pinData)}`);

	// Check that it is not null.
	if ( pinData && pinData.pin ) {
		// Store the pin.
		motionAlarm.setAlarmPin(pinData.pin).then(() => {
			console.log("Pin set, returning OK");
			// And return HTTP OK success code.
			res.sendStatus(HttpStatus.OK)
		});
	} else {
		// Error, no pin was sent. Send a bad request HTTP error code.
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

// The function which will compare a pin with what is stored for equality.
exports.matchPin = function(req,res) {
	console.log(`alarmController.matchPin() ENTERED`);

	// Get the pin from the request body
	const pinData = req.body;
	console.log(`alarmController.matchPin, pinData= ${JSON.stringify(pinData)}`);

	// Check that it is not null.
	if ( pinData && pinData.pin ) {
		// Compare the sent pin with what is stored.
		motionAlarm.matchPin(pinData.pin).then((match) => {
			if ( match ) {
				// If it matched, return HTTP OK success code.
				res.sendStatus(HttpStatus.OK);
			} else {
				// The pin did not match, send the UNAUTHORIZED HTTP error code.
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		});

	} else {
		// Error, no pin was sent. Send a bad request HTTP error code.
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

// The function which will change the pin.
exports.changePin = function(req,res) {
	console.log(`alarmController.changePin() ENTERED`);

	// Get the pins from the request body. Here there will be 2 pins. The current pin and the new pin.
	const pinData = req.body;
	console.log(`alarmController.setPin, pinData= ${JSON.stringify(pinData)}`);

	// Check that they are not null.
	if ( pinData && pinData.pin && pinData.currentPin ) {
		// Compare the currentPin that was send with waht is stored.
		motionAlarm.matchPin(pinData.currentPin).then((match) => {
			// If the currentPin matches, set the pin.
			if ( match ) {
				// The setPin will return the HTTP OK success code.
				exports.setPin(req, res);
			} else {
				// The pin did not match, send the UNAUTHORIZED error code.
				res.status(HttpStatus.UNAUTHORIZED).send('The current pin entered was invalid. Please double check the information you entered and try again.');
			}
		});

	} else {
		// Error, no pin was sent. Send a bad request HTTP error code.
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

// Turn on (arm) the alarm.
exports.armMotionDetection = function(req, res) {
	console.log(`alarmController.armMotionDetection() ENTERED`);

	// Get the pin from the request body
	const pinData = req.body;
	console.log(`alarmController.armMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	// Check that it is not null.
	if ( pinData && pinData.pin ) {
		// Retrieve the stored pin.
		motionAlarm.alarmPin.then((value) => {
			// Compare the pin that was sent with the stored value.
			if ( pinData.pin === value ) {
				// If the pins match, arm the alarm.
				motionAlarm.arm();
				// And return HTTP OK success code.
				res.sendStatus(HttpStatus.OK);
			} else {
				// The pin did not match, send the UNAUTHORIZED HTTP error code.
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		})
	} else {
		// Error, no pin was sent. Send a bad request HTTP error code.
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

// Turn off (disarm) the alarm.
exports.disarmMotionDetection = function(req, res) {
	console.log(`alarmController.disarmMotionDetection() ENTERED`);

	// Get the pin from the request body
	const pinData = req.body;
	console.log(`alarmController.disarmMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	// Check that it is not null.
	if ( pinData && pinData.pin ) {
		// Retrieve the stored pin.
		motionAlarm.alarmPin.then((value) => {
			// Compare the pin that was sent with the stored value.
			if ( pinData.pin === value ) {
				// If the pins match, disarm the alarm.
				motionAlarm.disarm();
				// And return HTTP OK success code.
				res.sendStatus(HttpStatus.OK);
			} else {
				// And return HTTP OK success code.
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		})
	} else {
		// Error, no pin was sent. Send a bad request HTTP error code.
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

// The function which returns the current alarm state. One of "NoPin", "Armed", "Disarmed" or "Alarming"
exports.getAlarmState = function(req, res) {
	// console.log(`alarmController.getAlarmState() ENTERED`);

	// Retrieve the alarm state.
	motionAlarm.alarmState.then((value) => {
		// console.log('getAlarmState(), value= ' + value);
		// And return it with an HTTP OK success code.
		res.status(HttpStatus.OK).send(value);
	});
};

// Get the picture (jpeg image) that was captured when that triggered the motion alarm.
exports.getMotionPic = function(req, res) {
	// console.log(`alarmController.getMotionPic() ENTERED`);

	// Retrieve the jpeg image data.
	motionAlarm.motionPic.then((value) => {
		// console.log('getMotionPic(), value= ' + value);
		// console.log(typeof value);
		// console.log(JSON.stringify(value));

		// Check that it is not null.
		if ( value ) {
			// Set the HTTP Content-Type header
			res.writeHead(HttpStatus.OK, {"Content-Type": "image/jpeg"});
			// And return the image data as a Buffer.
			res.write(new Buffer(value));
		} else
			// No image was currently not stored. Return a NOT_FOUND HTTP error code.
			res.status(HttpStatus.NOT_FOUND).send("Not found.");
	});
};
