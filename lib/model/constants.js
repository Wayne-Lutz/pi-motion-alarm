// This is a class which holds application wise constants

module.exports = class Constants {
	// The keys we use to store data using node-persist
	static get storageKeys() {
		return {
			ALARM_PIN: "alarm_pin", // The PIN data.
			ALARM_STATE: "alarm_state", // The Alarm State data.
			MOTION_PIC: "motion_pic" // The image data of the picture that was captured when the alarm was triggered
		};
	}

	// The different alarm states the application can hold.
	static get alarmStates() {
		return {
			ALARM_NO_PIN: "NoPin", // The first time the app is run the pin needs to be set.
			ALARM_ARMED: "Armed", // The alarm is armed (enabled).
			ALARM_DISARMED: "Disarmed", // The alarm is disarmed (disabled).
			ALARM_ALARMING: "Alarming" // The alarm is alarming (motin was detected).
		};
	}
}
