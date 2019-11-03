/**
 * Created by wlutz on 10/22/19.
 */
const path = require('path');
const MotionDetectionModule = require('pi-motion-detection');

const storage = require('node-persist');
const Constants = require('./model/constants');

class MotionAlarm {

	constructor() {
		this.motionDetector = new MotionDetectionModule({
			captureDirectory: path.resolve(__dirname, 'captures'),
		});

		this.motionDetector.on('motion', () => {
			console.log('motion!');
		});

		this.motionDetector.on('error', (error) => {
			console.error("motion error: " + error);
		});

		storage.init( /* options ... */ ).then(() => {
			console.log('Storage initialized.');
			storage.getItem(Constants.storageKeys.ALARM_STATE).then((value) => {
				console.log('value= ' + value);
				if ( value === Constants.alarmStates.ALARM_RUNNING )
					this.start();
			});
		});
	}

	start() {
		console.log("MotionAlarm.start()");

		this.motionDetector.watch();
	}

	stop() {
		console.log("MotionAlarm.stop()");
	}

}

module.exports = new MotionAlarm();
