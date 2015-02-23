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
		window.location.replace("http://sc-4.cs.mun.ca/adminHome");
	}

	else if (isRegisteredUser()) {
		alert("Welcome back to the Simulation! Your token has been detected. You will"
				+ "be redirected to the User Home Page.");
		window.location.replace("http://sc-4.cs.mun.ca/userHome");
	}
}

function registerButtonClickHandler() {

	var token = document.getElementById("token_input").value;

	var url = "http://" + window.location.host + "/registerWithToken";

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

function adminLoginButtonClickHandler() {
	var username = document.getElementById("username_field").value;
	var password = document.getElementById("password_field").value;
	var administrator1 = new administrator(username, password);
	/*
	var authenticated = adminLogin(username, password);
	if (authenticated) {
		localStorage.setItem("username", username);
		localStorage.setItem("password", password);
		window.location.assign("http://sc-4.cs.mun.ca/adminHome");
	} else {
		alert("Invalid username/password combo.");
	}
	*/
	db.administrators.find(administrator1, function(err, Admin){
	if( err || !Admin.length){
		console.log("Administraor " + administrator.email + " not found.")
		alert(";
	else administrators.forEach( function(administrator){
		console.log("Administrator found! - " + administrator.email);
		window.location.replace("http://sc-4.cs.mun.ca/adminHome");
		var url = "http://" + window.location.host + "/adminHome";
	} );
});
}