/*window.onload = function()
{
	if ((!isRegisteredUser()) && (!isAdministrator()))
	{
		alert("No valid token detected. This device must be registered with the "
		    + "Simulation to run this application. You will be redirected to the "
		    + "index page.");
		window.location.assign("http://" + window.location.host + "/index");
	}
};
 */

function load_comingSoon()
{
	var comingSoon = '<object type="text/html" data="comingSoon.hjs" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = comingSoon;
}