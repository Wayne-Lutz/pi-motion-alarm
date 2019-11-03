$(function() {
	$( "#PINform" ).draggable();
});

function addNumber(e){
	var v = $( "#PINbox" ).val();
	$( "#PINbox" ).val( v + e.value );
}
function delNumber(){
	var v = $( "#PINbox" ).val();
	$( "#PINbox" ).val( v.slice(0, -1) );
}
function clearForm(e){
	//document.getElementById('PINbox').value = "";
	$( "#PINbox" ).val( "" );
}
function submitForm(e) {
	if (e.value === "") {
		alert("Enter a PIN");
	} else {
		// alert( "Your PIN has been sent! - " + e.value );
		var data = {
			pin: e.value
		};

		console.log("data= " + JSON.stringify(data));

		// apiCall( data, function( r ) {
		// 	console.log("r= " + JSON.stringify(r));
		// });

		fetch("/api/alarm/enterPin", {
			method: 'POST', // or 'PUT'
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

		$( "#PINbox" ).val( "" );
	};
};


function apiCall( post, callback ) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/api/alarm/enterPin",
		data: JSON.stringify( post ),
		dataType: "json",
		success: function ( r ) {
			callback( r );
		},
		error: function ( response ) {
			console.error( response )
		},
	});
}
