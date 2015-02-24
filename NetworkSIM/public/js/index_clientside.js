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
window.onload = function() {
	if (isAdministrator()) {
		alert("Welcome back, Administrator. Stored username/password authenticated. You will"
				+ " be redirected to the Admin Home Page.");
		window.location
				.replace("http://" + window.location.host + "/adminHome");
	} else {
		alert("Just ran isAdministrator() and it returned false");
	}

	if (isRegisteredUser()) {
		alert("Welcome back to the Simulation! Your token has been detected. You will"
				+ "be redirected to the User Home Page.");
		window.location.replace("http://" + window.location.host + "/userHome");
	}
};

function registerButtonClickHandler() {
	var token = document.getElementById("token_field").value;
	console.log("token input is " + token); 
	var url = "http://" + window.location.host + "/registerWithToken";
	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.onload = function() {
		if (request.status === 200) {
			localStorage.setItem("token", token);
			alert("This device has been registered successfully. You may now access "
					+ "the simulation and its applications. Your token is saved in your "
					+ "browser so login will be automatic.");
		} else if (request.status === 400) {
			alert("This is not a valid token. Please contact the simulation administrator.");
		}
	}
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.send("token="+token);
}
function adminLoginButtonClickHandler() {
	var username = document.getElementById("username_field").value;
	var password = document.getElementById("password_field").value;
	var url = "http://" + window.location.host + "/adminLogin";
	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.onload = function() {
		if (request.status === 200) {
			localStorage.setItem("username", username);
			localStorage.setItem("password", password);
			alert("Successful authentication. Redirecting to Administrator Home.");
			window.location.assign("http://" + window.location.host
					+ "/adminHome");
		} else if (request.status === 400) {
			alert("Invalid username/password combo.");
		}
	}
	/*
	 * request.setRequestHeader("Content-Type", "application/json");
	 * request.send({ "username" : username, "password" : password });
	 */
	request.setRequestHeader('Content-Type',
			'application/x-www-form-urlencoded');
	request.send("username=" + username + "&password=" + password);
}
