/**
 * Created by wlutz on 10/22/19.
 */
const storage = require('node-persist');
const Raspistill = require('node-raspistill').Raspistill;
const Jimp = require('jimp');
const Constants = require('./model/constants');

class MotionAlarm {
	constructor() {
		this.COMPARE_THRESHOLD = 0.1;
		this.COMPARE_PERCENT_DIFF = 0.001;

		this.camera = new Raspistill({
			noFileSave: true,
			noPreview: true,
			width: 100,
			time: 1
		});

		storage.init( /* options ... */ ).then(() => {
			console.log('Storage initialized.');
			storage.getItem(Constants.storageKeys.ALARM_STATE).then((value) => {
				console.log('value= ' + value);
				// if ( value === Constants.alarmStates.ALARM_RUNNING )
					this.start();
			});
		});
	}

	start() {
		console.log("MotionAlarm.start()");
		this.camera.takePhoto().then((photo1) => {
			console.log("photo1");
			this.camera.takePhoto().then((photo2) => {
				console.log("photo2");
				Jimp.read(photo1)
					.then(image1 => {
						console.log("read1");
						Jimp.read(photo2)
							.then(image2 => {
								console.log("read2");
								const diff = Jimp.diff(image1, image2, this.COMPARE_THRESHOLD);
								const motionDetected = diff.percent > this.COMPARE_PERCENT_DIFF;
								console.log("motionDetected= " + motionDetected);
							})
							.catch(err => {
								console.error("read2 err: ", err);
							});
					})
					.catch(err => {
						console.error("read1 err: ", err);
					});
			});
		});
	}

	stop() {
		console.log("MotionAlarm.stop()");
	}

}

module.exports = new MotionAlarm();
