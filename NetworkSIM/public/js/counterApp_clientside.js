window.onload = counterAppOnloadFunction;

function sendPostRequest(data, url) {
	var request = new XMLHttpRequest();
	request.open("POST", url);
	request.send(data);
}

function counterAppOnloadFunction() {
	var lc = localStorage.getItem("localCount");
	if (!lc) {
		lc = 0;
		localStorage.setItem("localCount", lc);
	}
	document.getElementById("lc_span").innerHTML = lc;
	document.getElementById("gc_span").innerHTML = lc; // For now, until RDT
}

function incrementButtonHandler() {

	// To update database
	var token = localStorage.getItem("token");
	var url = "http://sc-4.cs.mun.ca/increment";
	var data = {
		"token" : token
	};
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

function decrementButtonHandler() {

	// To update database
	var token = localStorage.getItem("token");
	var url = "http://sc-4.cs.mun.ca/decrement";
	var data = {
		"token" : token
	};
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