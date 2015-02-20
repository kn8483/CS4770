$(function() {
	$('#toggle-admin').click(function() {
		$('#AdminForm').toggle();
		$('#RegisterForm').toggle();
	});
});

$(function() {
	$('#toggle-register').click(function() {
		$('#RegisterForm').toggle();
		$('#AdminForm').toggle();
	});
});

// -------------------------------------------------------------------------

window.onload = checkTokenInLocalStorage;

function checkTokenInLocalStorage() {
	var token = localStorage.getItem("token");

	if (token) {

		var valid = validateToken(token);

		if (valid) {
			alert("Welcome back to the Simulation! Your token has been detected. You will"
					+ "be redirected to the User Home Page.");
			window.location.replace("http://sc-4.cs.mun.ca/userHome.hjs");
		}

		else {
			console
					.log("There is a token in local storage and a request was sent"
							+ " to the server to validate it, but that request returned false.");
		}

	}
}

function validateToken(token) {

	var url = "http://sc-4.cs.mun.ca/validateToken";

	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.onload = function() {
		if (request.status === 200) {
			return true;
		}

		else if (request.status === 400) {
			return false;
		}
	}
	request.send(token);
}

function registerButtonClickHandler() {

	var token = document.getElementById("token_input").value;

	var url = "http://sc-4.cs.mun.ca/registerWithToken";

	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.onload = function() {
		if (request.status === 200) {
			localStorage.setItem("token", token);
			alert("This device has been registered successfully. You may now access "
					+ "the simulation and its applications. Your token is saved in your "
					+ "browser so login will be automatic.");
		}

		else if (request.status === 400) {
			alert("This is not a valid token. Please contact the simulation administrator.");
		}
	}
	request.send(token);

}