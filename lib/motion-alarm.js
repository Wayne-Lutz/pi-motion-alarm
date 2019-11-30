// The MotionAlarm class which contains the core logic for capturing/comparing and
//  storing the images and the PIN dat ETC.

// We use the node-persist for simple file based storage
const storage = require('node-persist');
// The module which uses the rapistill command line program to capture pictures.
const Raspistill = require('node-raspistill').Raspistill;
// An image manipulation library we use for comparing images.
const Jimp = require('jimp');
// Our Constants class we use to store app constants
const Constants = require('./model/constants');

class MotionAlarm {
	// THE MotionAlarm constructor
	constructor() {
		// Create our Rapistill camera instance
		this.camera = new Raspistill({
			noFileSave: true, // We don't want to save anything to file but keep the image in memory.
			noPreview: true, // We don't want a preview window to appear on the raspberr pi
			width: 400, // The image width
			time: 1 // Wait 1 second (the minimun) before capturing the image.
		});

		// Initialize the node-perisist storate.
		storage.init( /* options ... */ ).then(() => {
			console.log('Storage initialized.');
			this.disarm();

			storage.getItem(Constants.storageKeys.ALARM_PIN).then((value) => {
				console.log('ALARM_PIN= ' + value);
				if ( !value ) {
					storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_NO_PIN);
				}
			});
		});
	}

	// The method for detecing motion.
	// The image1 paramater is the first image captured, used to compare with the latest
	// captured image to detect motion changes.
	_detectMotion(image1) {
		// Only do this if we are armed.
		if ( this.armed  ) {
			// Take a picture.
			this.camera.takePhoto().then((photo) => {
				// The photo variable contains the newly captured picture data.
				// Use Jimp to convert that to an image we can use.
				Jimp.read(photo).then(image2 => {
					// The first time through image1 will be null (no previous picture)
					if ( image1 ) {
						// Compare the newly captured image with the first image captured.
						// The Jimp documentaion at https://www.npmjs.com/package/jimp
						// shows this as a good way to compare images.
						const distance = Jimp.distance(image1, image2); // perceived distance
						const diff = Jimp.diff(image1, image2); // pixel difference
						const motionDetected = (distance >= 0.15 && diff.percent >= 0.15);

						// If motion was detected, store the photo data that was captured so we
						// can send that to the browser, and store the ALARM_SATE to be ALARM_ALARMING.
						if ( motionDetected) {
							storage.updateItem(Constants.storageKeys.MOTION_PIC, photo).then(() =>
								storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_ALARMING));
						} else {
							// Other recurse, passing the initial image captured back in.
							this._detectMotion(image1);
						}
					} else {
						// If this is the first time, recurse, passing in the image captured as the first image.
						this._detectMotion(image2);
					}
				})
				.catch(err => {
					// There was some type of error, log to the console.
					console.error("read1 err: ", err);
				});
			});
		}
	}

	// Arm (enable) the alarm.
	arm() {
		console.log("MotionAlarm.arm()");
		// When we arm, we remove any previously stored photo data.
		storage.removeItem(Constants.storageKeys.MOTION_PIC);
		// And store the ALARM_STATE as ALARM_ARMED
		storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_ARMED);
		this.armed = true;
		// And call the _detectMotion() method with null since this is the first call.
		this._detectMotion(null);
	}

	// Disarm (disable) the alarm.
	disarm() {
		console.log("MotionAlarm.disarm()");
		this.armed = false;
		// Set the ALARM_STATE to be ALARM_DISARMED
		return storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_DISARMED);
	}

	// Match the pin passed in with the pin that is currently stored.
	matchPin(pin) {
		let match = false;

		// Make sure the pin is not null.
		if ( pin ) {
			// We use a Javascript Promise
			return new Promise((resolve, reject) => {
				// Retrieve the pi9n; node-persist uses a promise since
				// retrieving data from the file system is an asynchronous process.
				this.alarmPin.then((value => {
					// Resolve the promise with either true or false.
					resolve(pin === value);
				}))
			});
		} else {
			// If no pin, just resolve as false.
			return Promise.resolve(false);
		}
	}

	// A Javascript git method for returning the alarmState
	get alarmState() {
		return storage.getItem(Constants.storageKeys.ALARM_STATE);
	}

	// A Javascript git method for returning the alarmPin
	get alarmPin() {
		return storage.getItem(Constants.storageKeys.ALARM_PIN);
	}

	// Set the Alarm Pin
	setAlarmPin(pin) {
		// Sore the pin usingnode-persist.
		// Since node-perist uses the file system, it uses Javascript Promises for asynchrounous processes.
		return storage.setItem(Constants.storageKeys.ALARM_PIN, pin).then(() => {
			console.log("setAlarmPin() success");
			// Now retrieve the currently stored ALARM_STATE.
			return storage.getItem(Constants.storageKeys.ALARM_STATE).then((state) => {
				console.log("setAlarmPin().slarmState= " + state);
				// If this is the very first time the app is run, there will be no PIN,
				// the user needs to set the initial pin.
				if ( state === Constants.alarmStates.ALARM_NO_PIN ) {
					console.log("ALARM_NO_PIN, disarming");
					// return storage.removeItem(Constants.storageKeys.ALARM_STATE);
					return this.disarm();
				} else {
					// Otherwise just resolve the Promise.
					return Promise.resolve();
				}
			});
		});
	}

	// Get the picture that was captured when the alarm was triggered.
	get motionPic() {
		return storage.getItem(Constants.storageKeys.MOTION_PIC);
	}
}

module.exports = new MotionAlarm();
