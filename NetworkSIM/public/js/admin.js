function load_networkSettings(){
	var networkSettings = '<object type="text/html" data="networkSettings.hjs" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = networkSettings;
}
function load_tokenDelivery(){
	var tokenDelivery = '<object type="text/hjs" data="tokenDelivery.hjs" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = tokenDelivery;
}
function load_comingSoon(){
	var comingSoon = '<object type="text/html" data="comingSoon.hjs" style="width:100%; height:100%;"></object>';
	document.getElementById("ViewWindow").innerHTML = comingSoon;
}