function isRegisteredUser() {

	var token = localStorage.getItem("token");

	if (token) {
		return validateToken(token);
	}

	else {
		return false;
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

function isAdministrator() {
	var username = localStorage.getItem("username");
	var password = localStorage.getItem("password");

	if (username && password) {

		return adminLogin(username, password);

	}

	else {
		return false;

	}
}

function adminLogin(username, password) {

	var url = "http://sc-4.cs.mun.ca/adminLogin";

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
	var data = {
		"username" : username,
		"password" : password
	}
	request.send(data);
}