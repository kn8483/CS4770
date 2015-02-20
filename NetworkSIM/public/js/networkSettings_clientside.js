window.onload = function() {
	if ((!isAdministrator())) {
		alert("No valid stored username/password detected. You must be a Simulation "
				+ "administrator to access this page. You will be redirected to the "
				+ "index page.");
		window.location.replace("http://sc-4.cs.mun.ca/");
};

// ---------------- Input Fields ------------------------------
var importRdtName = document.getElementById("importRdtName");
var removeRdtName = document.getElementById("removeRdtName");
var importAppName = document.getElementById("importAppName");
var removeAppName = document.getElementById("removeAppName");
var addNetworkName = document.getElementById("addNetworkName");
var addNetworkKind = document.getElementById("addNetworkKind");
var removeNetworkName = document.getElementById("removeNetworkName");
var addDeviceName = document.getElementById("addDeviceName");
var removeDeviceName = document.getElementById("removeDeviceName");
var addDeviceToNetworkNetworkName = document
		.getElementById("addDeviceToNetworkNetworkName");
var addDeviceToNetworkDeviceName = document
		.getElementById("addDeviceToNetworkDeviceName");
var removeDeviceFromNetworkNetworkName = document
		.getElementById("removeDeviceFromNetworkNetworkName");
var removeDeviceFromNetworkDeviceName = document
		.getElementById("removeDeviceFromNetworkDeviceName");
var connectNetwork1Name = document.getElementById("connectNetwork1Name");
var connectNetwork2Name = document.getElementById("connectNetwork2Name");
var disconnectNetwork1Name = document.getElementById("disconnectNetwork1Name");
var disconnectNetwork2Name = document.getElementById("disconnectNetwork2Name");
var removeDeviceFromCurrentNetworkDeviceName = document
		.getElementById("removeDeviceFromCurrentNetworkDeviceName");
var returnDeviceToPreviousNetworkDeviceName = document
		.getElementById("returnDeviceToPreviousNetworkDeviceName");

// ---------------------- Buttons -------------------------------------

function sendPostRequest(data, url) {
	var request = new XMLHttpRequest();
	request.open("POST", url);
	/*
	 * request.onload = function() { if (request.status == 200) {
	 * alert("Success! (status code 200 received)"); // Page should be refreshed //
	 * Call render in server to serve new page } else { alert("Uhhh.....status
	 * code 200 not received..."); } }
	 */
	request.send(data);
}

function importRdtClickHandler() {
	var name = importRdtName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/importRDT";

	sendPostRequest(data, url);
}
function removeRdtClickHandler() {
	var name = removeRdtName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/removeRDT";

	sendPostRequest(data, url);
}
function importAppClickHandler() {
	var name = importAppName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/importApp";

	sendPostRequest(data, url);
}
function removeAppClickHandler() {
	var name = removeAppName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/removeApp";

	sendPostRequest(data, url);
}
function addNetworkClickHandler() {
	var networkName = addNetworkName.value;
	var networkKind = addNetworkKind.value;

	var data = {
		"networkName" : networkName,
		"networkKind" : networkKind
	};

	var url = "http://sc-4.cs.mun.ca/addNetwork";

	sendPostRequest(data, url);
}
function removeNetworkClickHandler() {
	var name = removeNetworkName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/removeNetwork";

	sendPostRequest(data, url);
}
function addDeviceClickHandler() {
	var name = addDeviceName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/addDevice";

	sendPostRequest(data, url);
}

function removeDeviceClickHandler() {
	var name = removeDeviceName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/removeDevice";

	sendPostRequest(data, url);
}
function addDeviceToNetworkClickHandler() {
	var networkName = addDeviceToNetworkNetworkName.value;
	var deviceName = addDeviceToNetworkDeviceName.value;

	var data = {
		"networkName" : networkName,
		"deviceName" : deviceName
	};

	var url = "http://sc-4.cs.mun.ca/addDeviceToNetwork";

	sendPostRequest(data, url);
}
function removeDeviceFromNetworkClickHandler() {
	var networkName = removeDeviceToNetworkNetworkName.value;
	var deviceName = removeDeviceToNetworkDeviceName.value;

	var data = {
		"networkName" : networkName,
		"deviceName" : deviceName
	};

	var url = "http://sc-4.cs.mun.ca/removeDeviceFromNetwork";

	sendPostRequest(data, url);
}
function connectNetworksClickHandler() {
	var network1Name = connectNetwork1Name.value;
	var network2Name = connectNetwork2Name.value;

	var data = {
		"network1Name" : network1Name,
		"network2Name" : network2Name
	};

	var url = "http://sc-4.cs.mun.ca/connectTwoNetworks";

	sendPostRequest(data, url);
}
function disconnectNetworksClickHandler() {
	var network1Name = disonnectNetwork1Name.value;
	var network2Name = disconnectNetwork2Name.value;

	var data = {
		"network1Name" : network1Name,
		"network2Name" : network2Name
	};

	var url = "http://sc-4.cs.mun.ca/disconnectTwoNetworks";

	sendPostRequest(data, url);
}
function removeDeviceFromCurrentClickHandler() {
	var name = removeDeviceFromCurrentNetworkDeviceName.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/removeDeviceFromCurrentNetwork";

	sendPostRequest(data, url);
}
function returnDeviceFromPreviousHandler() {
	var name = returnDeviceToPreviousNetwork.value;

	var data = {
		"name" : name
	};

	var url = "http://sc-4.cs.mun.ca/returnDeviceToPreviousNetwork";

	sendPostRequest(data, url);
}
