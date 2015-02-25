var oActive;
var nMouseX, nMouseY;
var nStartX, nStartY;
var bMouseUp = true;
var nZFocus = 100;//the highest z-Index present in your page plus 1:


(function () {
	document.onmousemove = function(event){
		if(bMouseUp){
			return;
		}
		var oMsEvent2 = event || window.event;//IE 
		oActive.style.left = String(nStartX + oMsEvent2.clientX - nMouseX) + "px";
		oActive.style.top = String(nStartY + oMsEvent2.clientY - nMouseY) + "px";
	};


	document.onmouseup = function(){
		bMouseUp = true;
	};
})();

function activatePopUp(event){
	console.log("activatePopUp: " + "I tried to start");
	
	var popupWindow = document.createElement("div");
	popupWindow.className = "draggable";
	var theCurrentDate = new Date();
	popupWindow.name = "n" + theCurrentDate.getTime();
	popupWindow.id="id" + theCurrentDate.getTime();//"pu002";//using number of milliseconds past january 1, 1970 as a unique id
	popupWindow.setAttribute("draggable", "true");
	popupWindow.ondragstart = startDragListener;
	popupWindow.ondrop = dropListener;
	popupWindow.ondragover = isDropAllowed;

	var topheading = document.createElement("pre");
	topheading.innerHTML = "MUN";

	var spacing = document.createElement("span");
	spacing.setAttribute("style", "padding:45px");
	topheading.appendChild(spacing);

	var closer = document.createElement("a");
	closer.setAttribute("style", "color:red");
	closer.innerHTML="close";
	closer.name = popupWindow.name;
	closer.onclick = closePopUp;
	topheading.appendChild(closer);
	popupWindow.appendChild(topheading);
	document.getElementById("outerDiv").appendChild(popupWindow);


};


function createNetwork(){


};



//This function closes popup windows
function closePopUp(event){
	console.log("closePopUp: " + "I tried to close popup");
	//event.target.setAttribute("hidden");
	//console.log(event.target.id);
	//console.log(document.getElementsByName(event.target.name)[0].name);
	//console.log(document.getElementsByName(event.target.name)[1].name);
	var x=document.getElementsByTagName("div").length;
	var y=document.getElementsByTagName("div");
	for(var i=0; i< x; i++){
		if(y[i].name===event.target.name){
			document.getElementById("outerDiv").removeChild(y[i]);
			i=x;//Do not search any more then we need to
		}
	}
	//var x = document.getElementsByName(event.target.name)[1];//popup windows have the same "name" as there <a>
	//document.getElementById("outerDiv").removeChild(document.getElementsByName(event.target.name));
	//document.getElementById("outerDiv").removeChild(document.getElementById("pu002"));
	//document.getElementById("outerDiv").removeChild(document.getElementById(event.target.id));
};

//This listener detects when a drag operation is happening and associates the operation with the correct object
function startDragListener(event){
	//console.log(event.target.id);
	switch(event.target.className){
		case "draggable":
			console.log("startDragListener (pu001 popup Window): " + event.target.className);
			(function(){
				var bExit = true;
				var oMsEvent1 = event || window.event;//IE
				for(var iNode = oMsEvent1.target || /* IE */ oMsEvent1.srcElement; iNode; iNode = iNode.parentNode){
					if(iNode.className === "draggable"){
						bExit = false;
						oActive = iNode;
						break;
					}
				}
				if(bExit){
					return;
				}
				bMouseUp = false;
				nStartX = nStartY = 0;
				for(var iOffPar = oActive; iOffPar; iOffPar = iOffPar.offsetParent){
					nStartX += iOffPar.offsetLeft;
					nStartY += iOffPar.offsetTop;
				}
				nMouseX = oMsEvent1.clientX;
				nMouseY = oMsEvent1.clientY;
				oActive.style.zIndex = nZFocus++;
				return false;

			})();
			break;
		default:
			console.log("startDragListener (general): " + event.target.id);
			event.dataTransfer.setData("device", event.target.id);
			//event.dataTransfer.effectAllowed = "copyMove";
			//event.dataTransfer.dropEffect = "copy";
			break;
		}
};

//This is the function where you would put the code to update the server on the change the client made
function dropListener(event){
	var dataPasser = event.dataTransfer.getData("device");
	console.log("dropListener: " + event.target.id);
	event.target.appendChild(document.getElementById(dataPasser));//There might be a nesting issue here
	//event.dataTransfer.dropEffect = "copy";
	
};

//This function allows control over what can be dragged to what. Ultmitly the server will have final say
//The ID field goes by the following pattern the <device>+<continually increasing counter value
//Fixme plan needs to be put in place to account for counter roll over, a possibily is leave naming up to user
function isDropAllowed(event){
	if(event.dataTransfer.getData("device") != ""){
		//var patt = /[0123456789]/g;
		//console.log("isDropAllowed1 (Dragged Element, ID): " + event.dataTransfer.getData("device"));
		//console.log("isDropAllowed2: " + event.target.className);
		//console.log("isDropAllowed3 (Dragged Element, className): " + document.getElementById(event.dataTransfer.getData("device")).className);
		switch(document.getElementById(event.dataTransfer.getData("device")).className){
			case 'clientContainer'://client can be dragged to a
				switch(event.target.className){
					case 'routerContainer':
						event.preventDefault();
					break;
					case 'networkContainer':
						event.preventDefault();
					break;
				}
			break;
			case 'routerContainer'://A router can be dragged to a
				switch(event.target.className){
					case 'routerContainer':
						event.preventDefault();
					break;
					case 'networkContainer':
						event.preventDefault();
					break;
					case 'draggable':
						event.preventDefault();
					break;
				}
			break;
		}
	}
};