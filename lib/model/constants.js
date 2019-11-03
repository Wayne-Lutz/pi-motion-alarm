/**
 * Created by wlutz on 10/22/19.
 */

module.exports = class Constants {
	static get storageKeys() {
		return {
			ALARM_STATE: "alarm_state"
		};
	}

	static get alarmStates() {
		return {
			ALARM_ARMED: "Armed",
			ALARM_DISARMED: "Disarmed",
			ALARM_ALARMING: "Alarming"
		};
	}
}
