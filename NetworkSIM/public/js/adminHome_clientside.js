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

function load_networkSettings()
{
	var networkSettings = '<object type="text/html" data="networkSettings" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = networkSettings;
}
function load_tokenDelivery()
{
	var tokenDelivery = '<object type="text/hjs" data="tokenDelivery" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = tokenDelivery;
}
function load_comingSoon()
{
	var comingSoon = '<object type="text/html" data="comingSoon" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = comingSoon;
}