window.onload = function()
{
	if ((!isAdministrator()))
	{
		alert("No valid stored username/password detected. You must be a Simulation "
		    + "Administrator to access this page. You will be redirected to the "
		    + "index, where you can login.");
		window.location.assign("http://" + window.location.host + "/");
	}
};

function sendTokenButtonHandler()
{
	var email = document.getElementById("email_field").value;
	console.log("email is" + email);
	var request = new XMLHttpRequest();
	var url = "http://" + window.location.host + "/distributeToken";
	request.open("POST", url);
	request.onload = function()
	{
		if (request.status === 200)
		{
			alert("An e-mail with a token has been sent to " + email);
		}

		else if (request.status === 400)
		{
			alert("There are no unassigned devices available in the Simulation at this time. You may assign add more"
			    + "from the Network Settings page.");
		}
	};
	request.setRequestHeader("Content-Type",
	    "application/x-www-form-urlencoded");
	request.send("email=" + email);
}