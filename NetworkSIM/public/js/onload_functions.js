function isRegisteredUser() {

	var token = localStorage.getItem("token");

	if (token) {
		var url = "http://" + window.location.host + "/validateToken";
		var request = new XMLHttpRequest();
		request.open("POST", url);
		request.onload = function() {
			if (request.status === 200) {
				console
						.log("token "
								+ token
								+ " found in local storage and is valid. This is a registered device.")
				return true;
			} else if (request.status === 400) {
				console.log("Invalid token " + token
						+ " found in local storage.")
			}
		};
		request.setRequestHeader("Content-type",
				"application/x-www-form-urlencoded");
		request.send("token=" + token);
	}

	else {
		return false;
	}
}

function isAdministrator() {
	var username = localStorage.getItem("username");
	var password = localStorage.getItem("password");

	if (username && password) {

		var url = "http://" + window.location.host + "/adminLogin";
		var request = new XMLHttpRequest();
		request.open("POST", url);
		request.onload = function() {
			if (request.status === 200) {
				return true;

			} else if (request.status === 400) {
				return false;
			}
		};
		request.setRequestHeader("Content-type",
				"application/x-www-form-urlencoded");
		request.send("username=" + username + "&password=" + password);
	}

	else {
		return false;

	}
}