/**
 * New node file
 */

function sendTokenButtonHandler () { 
	var email = document.getElementById("email_field").value;
	console.log("email is" + email);
	var request = new XMLHttpRequest();
	var url = "http://" + window.location.host + "/distributeToken"; 
	request.open("POST", url);
	request.onload = function () {
		if (request.status === 200) {
			alert("An e-mail with a token has been sent to " + email); 
		}
		
		else if (request.status === 400) {
			alert("There are no unassigned devices in the Simulation at this time. Please contact the administrator."); 
		}
	}; 
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
	request.send("email="+email); 
}