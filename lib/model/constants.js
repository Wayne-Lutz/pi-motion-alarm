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
			ALARM_RUNNING: "alarm_running",
			ALARM_PAUSED: "alarm_paused",
			ALARM_STOPPED: "alarm_stopped",
			ALARM_ALARMING: "alarm_alarming"
		};
	}
}
