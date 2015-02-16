function registerButtonClickHandler() {

	var token = document.getElementById("token").value;

	var url = "http://sc-4.cs.mun.ca/submitToken";

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