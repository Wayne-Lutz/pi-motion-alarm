const USE_FETCH = true;
let alarmState, mode;

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

function togglePinPad(callback) {
	let label;

	clearPin();

	const pin_form = $("#pin_form");

	if ( pin_form.is(":visible") ) {
		pin_form.hide("fast", "swing", callback);
		label = "Show Pin Pad";
	} else {
		pin_form.show("fast", "swing", callback);
		label = "Hide Pin Pad";
	}

	$("#toggle_pin_pad").val(label);
}

function submitPin(e) {
	if (e.value === "") {
		alert("Please enter a PIN!");
	} else {
		const data = {
			pin: e.value
		};

		// console.log("data= " + JSON.stringify(data));

		let api;

		switch ( alarmState ) {
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

		if ( USE_FETCH ) {
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
				data: JSON.stringify( data ),
				success: function ( response ) {
					// console.log( "Success:  " + JSON.stringify(response));
					togglePinPad();
					monitorAlarm();
				},
				error: function ( response ) {
					console.error( "Error:  " + JSON.stringify(response));
					alert(response.responseText);
				},
			});
		}

		clearPin();
	}
}

function manageAlarm() {
	// $("#pin_form").show();
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
	$("#alarm_status").val("Alarm is " + alarmState)
	const motion_pic = $("#motion_pic");
	if ( alarmState === 'Alarming' ) {
		if ( !motion_pic.is(":visible") ) {
			motion_pic.show("fast", "swing", () => motion_pic.attr("src", "/api/alarm/motionPic?" +  (new Date()).getTime()));
		}
	} else if ( motion_pic.is(":visible") )
		$("#motion_pic").hide("fast", "swing");
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
					setAlarmButton();
					if (alarmState !== 'Disarmed')
						monitorAlarm();
				});
			}).catch(function (error) {
				console.error(error)
				if (alarmState !== 'Disarmed')
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
					setAlarmButton();
					if (alarmState !== 'Disarmed')
						monitorAlarm();
				},
				error: function ( response ) {
					console.error( "Error:  " + JSON.stringify(response));
					if (alarmState !== 'Disarmed')
						monitorAlarm();
				},
			});
		}
	}, 1000);
}

$("#pin_form").hide();
monitorAlarm();
