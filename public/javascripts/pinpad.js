$(function() {
	$( "#pin_form" ).draggable();
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

function submitPin(e) {
	if (e.value === "") {
		alert("Please enter a PIN!");
	} else {
		const data = {
			pin: e.value
		};

		console.log("data= " + JSON.stringify(data));

		fetch("/api/alarm/enterPin", {
			method: 'POST',
			body: JSON.stringify(data), // data can be `string` or {object}!
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function(response) {
			console.log("Success: statua: " + response.status + ", statusText: " + response.statusText + ", response.text(): " +
				response.text() + ", body: " + response.body);
		}).catch(function(error) {
			console.error(error)
		});

		clearPin();
	}
}

