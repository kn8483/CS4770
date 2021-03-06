window.onload = counterAppOnloadFunction; 

/*function() = 

{
	if ((!isRegisteredUser()) && (!isAdministrator()))
	{
		alert("No valid token detected. This device must be registered with the "
		    + "Simulation to run this application. You will be redirected to the "
		    + "index page.");
		window.location.assign("http://" + window.location.host + "/");
	}

	else
	{
		counterAppOnloadFunction();
	}
};*/

function sendPostRequest(data, url)
{
	var request = new XMLHttpRequest();
	request.open("POST", url);
	var s = "";
	for ( var x in data)
	{
		s += x + "=" + data[x] + "&";
	}
	console.log(s);
	request.onload = function()
	{
		if (request.status === 200)
		{
			alert("Status 200 received! Operation successful!");
			window.location.reload();
		}

		else
		{
			alert("No successful status code from server.");
		}
	}
	request.setRequestHeader("Content-Type",
	    "application/x-www-form-urlencoded");
	request.send(s);
}

function counterAppOnloadFunction()
{
	var lc = localStorage.getItem("localCount");
	if (!lc)
	{
		lc = 0;
		localStorage.setItem("localCount", lc);
	}
	document.getElementById("lc_span").innerHTML = lc;
	document.getElementById("gc_span").innerHTML = lc; // For now, until RDT
}
function incrementButtonHandler()
{
	// To update database
	var token = localStorage.getItem("token");
	var url = "http://" + window.location.host + "/increment";
	var data =
		{ "token" : token };
	sendPostRequest(data, url);
	// To update local storage
	var lc = localStorage.getItem("localCount");
	lc = Number(lc);
	lc = lc + 1;
	localStorage.setItem("localCount", lc);
	// To update DOM
	document.getElementById("lc_span").innerHTML = lc;
	document.getElementById("gc_span").innerHTML = lc; // For now, until RDT
}
function decrementButtonHandler()
{
	// To update database
	var token = localStorage.getItem("token");
	var url = "http://" + window.location.host + "/decrement";
	var data =
		{ "token" : token };
	sendPostRequest(data, url);
	// To update local storage
	var lc = localStorage.getItem("localCount");
	lc = Number(lc);
	lc = lc - 1;
	localStorage.setItem("localCount", lc);
	// To update DOM
	document.getElementById("lc_span").innerHTML = lc;
	document.getElementById("gc_span").innerHTML = lc; // For now, until RDT
	// implementation
}