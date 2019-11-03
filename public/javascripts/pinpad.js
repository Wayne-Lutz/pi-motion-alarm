const USE_FETCH = true;
let alarmState, pin1, mode;

$(function() {
	$("#pin_form").draggable();
});

function addNumber(e){
	const box = $("#pin_box");
	const v = box.val();

	box.val(v + e.value);
}

function delNumber(){
	const box = $("#pin_box");
	const v = box.val();

	box.val( v.slice(0, -1) );
}

function clearPin() {
	$("#pin_box").val( "" );
}

function showPinPad(callback) {
	$("#pin_form").show("fast", "swing", callback);
}

function hidePinPad(callback) {
	$("#pin_form").hide("fast", "swing", callback);
}

function togglePinPad(callback) {
	clearPin();

	if ( $("#pin_form").is(":visible") ) {
		hidePinPad(callback)
	} else {
		showPinPad(callback);
	}
}

function submitPin(e) {
	if (e.value === "") {
		alert("Please enter a PIN!");
	} else {
		if ( alarmState === "NoPin" ) {
			if ( !pin1 ) {
				pin1 = e.value;
				$("#pin_msg").val("Re-enter PIN");
				clearPin();
				return;
			} else if (pin1 !== e.value ) {
				$("#pin_msg").val("PINs do not match, try again!");
				clearPin();
				pin1 = null;
				return;
			}
		}

		pin1 = null;
		const data = {
			pin: e.value
		};

		// console.log("data= " + JSON.stringify(data));

		let api;

		switch (alarmState) {
			case "NoPin":
				api = '/api/alarm/setPin';
				break;
			case "Armed":
				api = '/api/alarm/disarm';
				break;
			case "Disarmed":
				api = '/api/alarm/arm';
				break;
			case "Alarming":
				// api = '/api/alarm/arm';
				api = '/api/alarm/disarm';
				break;
		}

		if (USE_FETCH) {
			fetch(api, {
				method: 'POST',
				body: JSON.stringify(data), // data can be `string` or {object}!
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				// console.log("Success: status: " + response.status + ", statusText: " + response.statusText + ", response.text(): " +
				// 	response.text() + ", body: " + response.body);
				if (response.status === 200) {
					togglePinPad();
					monitorAlarm();
				} else {
					response.text().then((val) => {
						alert(val);
					});
				}
			}).catch(function (error) {
				console.error(error)
				alert(error);
			});
		} else {
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: api,
				data: JSON.stringify(data),
				success: function (response) {
					// console.log( "Success:  " + JSON.stringify(response));
					togglePinPad();
					monitorAlarm();
				},
				error: function (response) {
					console.error("Error:  " + JSON.stringify(response));
					alert(response.responseText);
				},
			});
		}

		clearPin();
	}
}

function manageAlarm() {
	togglePinPad(setAlarmButton);
}

function setAlarmButton() {
	let label;

	if ( $(pin_form).is(":visible") ) {
		label = "Cancel";
	} else {
		switch (alarmState) {
			case "Armed":
				label = "Disarm Alarm";
				break;
			case "Alarming":
				label = "Cancel Alarm";
				break;
			case "Disarmed":
			default:
				label = "Arm Alarm";
				break;
		}
	}

	$("#manage_alarm").val(label);
}

function setAlarmStatus() {
	const alarm_status = $("#alarm_status");
	const pin_msg = $("#pin_msg");

	if ( alarmState === 'NoPin' ) {
		alarm_status.val("Set your Alarm Pin");
		pin_msg.val("Set your PIN");
		pin_msg.show();
		showPinPad();
	} else {
		pin_msg.hide();
		alarm_status.val("Alarm is " + alarmState)
		const motion_pic = $("#motion_pic");

		if ( alarmState === 'Alarming' ) {
			if ( !motion_pic.is(":visible") ) {
				// motion_pic.show("fast", "swing", () => motion_pic.attr("src", "/api/alarm/motionPic?" +  (new Date()).getTime()));
				motion_pic.attr("src", "/api/alarm/motionPic?" +  (new Date()).getTime());
				setTimeout(() => {
					motion_pic.show("fast", "swing");
				}, 400);
				alarmSound.play();
			}
		} else if ( motion_pic.is(":visible") ) {
			motion_pic.hide("fast", "swing");
			alarmSound.stop();
		}

		setAlarmButton();
	}
}

function monitorAlarm() {
	setTimeout(() => {
		if ( USE_FETCH ) {
			fetch("/api/alarm/alarmState", {
				method: 'GET'
			}).then(function (response) {
				response.text().then((val) => {
					// console.log("text: val= '" + val + "'");
					alarmState = val;
					setAlarmStatus();
					if ((alarmState !== 'Disarmed') && (alarmState !== 'NoPin'))
						monitorAlarm();
				});
			}).catch(function (error) {
				console.error(error)
				if ((alarmState !== 'Disarmed') && (alarmState !== 'NoPin'))
					monitorAlarm();
			})
		} else {
			$.ajax({
				type: "GET",
				url: "/api/alarm/alarmState",
				success: function ( response ) {
					// console.log( "Success:  " + JSON.stringify(response));
					alarmState = response;
					setAlarmStatus();
					if ((alarmState !== 'Disarmed') && (alarmState !== 'NoPin'))
						monitorAlarm();
				},
				error: function ( response ) {
					console.error( "Error:  " + JSON.stringify(response));
					if ((alarmState !== 'Disarmed') && (alarmState !== 'NoPin'))
						monitorAlarm();
				},
			});
		}
	}, 1000);
}

function alarm(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	this.sound.loop = true;

	document.body.appendChild(this.sound);

	this.play = () => {
		this.sound.play();
	};

	this.stop = () => {
		this.sound.pause();
	}
}

$("#pin_form").hide();
let alarmSound = new alarm("/audio/siren.mp3");
// alarmSound.play();
monitorAlarm();
