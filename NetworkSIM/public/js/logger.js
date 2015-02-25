
function log(msg)
{
    if(arguments.length == 0)
        Logger.print(""); 
    else
        Logger.print(msg);
};
var Logger = (function()
{
    var containerDiv = null;
    var tabDiv = null;
    var logDiv = null;
    var visible = false;    // tab is still visible even if it is false
    var logHeight = 215;    
    // for animation
    var animTime = 0;
    var animDuration = 200; 
    var animFrameTime= 16;  

    // get time and date as string with a trailing space
    var getTime = function()
    {
        var now = new Date();
        var hour = "0" + now.getHours();
        hour = hour.substring(hour.length-2);
        var minute = "0" + now.getMinutes();
        minute = minute.substring(minute.length-2);
        var second = "0" + now.getSeconds();
        second = second.substring(second.length-2);
        return hour + ":" + minute + ":" + second;
    };
    var getDate = function()
    {
        var now = new Date();
        var year = "" + now.getFullYear();
        var month = "0" + (now.getMonth()+1);
        month = month.substring(month.length-2);
        var date = "0" + now.getDate();
        date = date.substring(date.length-2);
        return year + "-" + month + "-" + date;
    };
    // return available requestAnimationFrame(), otherwise, fallback to setTimeOut
    var getRequestAnimationFrameFunction = function()
    {
        var requestAnimationFrame = window.requestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame;
        if(requestAnimationFrame)
            return function(callback){ return requestAnimationFrame(callback); };
        else
            return function(callback){ return setTimeout(callback, 16); };
    };
		
    var self =
    {
        // create a div for log and attach it to document
        init: function()
        {
            // avoid redundant call
            if(containerDiv)
                return true;

            // check if DOM is ready
            if(!document || !document.createElement || !document.body || !document.body.appendChild)
                return false;

            // constants
            var CONTAINER_DIV = "loggerContainer";
            //var TAB_DIV = "loggerTab";
            var LOG_DIV = "logger";
            var Z_INDEX = 9999;

            // create logger DOM element
            containerDiv = document.getElementById(CONTAINER_DIV);
            if(!containerDiv)
            {
                // container
                containerDiv = document.createElement("div");
                containerDiv.id = CONTAINER_DIV;
                 containerDiv.setAttribute("style", "width:100%; " +
                                                   "height: " + logHeight + "px; " +
                                                   "margin-bottom:680px; " +
                                                   "padding:0; " +
                                                   "position:fixed; " +
                                                   "left:0; " +
                                                   "z-index:" + Z_INDEX + ";"); 
                containerDiv.style.bottom = "" + (-logHeight) + "px";   // hide it initially
                tabDiv = document.createElement("div");
				
                logDiv = document.createElement("div");
                logDiv.id = LOG_DIV;
                var cssHeight = "height:" + (logHeight - 11) + "px; ";  // subtract paddings and border-top
                logDiv.setAttribute("style", "font:12px monospace; " +
                                             cssHeight +
                                             "color:#fff; " +
                                             "overflow-x:hidden; " +
                                             "overflow-y:scroll; " +
                                             "visibility:hidden; " +
                                             "position:relative; " +
                                             "bottom:0px; " +
                                             "margin:0px; " +
                                             "padding:5px; " +
                                             "background:#333; " +
                                             "background:rgba(0, 0, 0, 0.9); " +
                                             "border-top:1px solid #aaa; "); 

                // style for log message
                var span = document.createElement("span");  // for coloring text
                span.style.color = "#afaa";
                span.style.fontWeight = "bold";

                // the first message in log
                var msg = " The logger is at " +
                          getDate() + ", " + getTime();
                          

                span.appendChild(document.createTextNode(msg));
                logDiv.appendChild(span);
                logDiv.appendChild(document.createElement("br"));   // blank line
                logDiv.appendChild(document.createElement("br"));   // blank line

                // add divs to document
                containerDiv.appendChild(tabDiv);
                containerDiv.appendChild(logDiv);
                document.body.appendChild(containerDiv);
            }

            return true;
        },
       
        // print log message to logDiv
        print: function(msg)
        {
           
            // check if this object is initialized
            if(!containerDiv)
            {
                var ready = this.init();
                if(!ready)
                    return;
            }

            var msgDefined = true;

            // convert non-string type to string
            if(typeof msg == "undefined")   // print "undefined" if param is not defined
            {
                msg = "undefined";
                msgDefined = false;
            }
            else if(msg === null)           // print "null" if param has null value
            {
                msg = "null";
                msgDefined = false;
            }
            else
            {
                msg += ""; // for "object", "function", "boolean", "number" types
            }

            var lines = msg.split(/\r\n|\r|\n/);
            for(var i in lines)
            {
                // format time and put the text node to inline element
                var timeDiv = document.createElement("div");            // color for time
                timeDiv.setAttribute("style", "color:#999;" +
                                              "float:left;");

                var timeNode = document.createTextNode(getTime() + "\u00a0");
                timeDiv.appendChild(timeNode);

                // create message span
                var msgDiv = document.createElement("div");
                msgDiv.setAttribute("style", "float:left;" +
                                             "word-wrap:break-word;" +  // wrap msg
                                             "width:90%;");             // the width must be defined here
                if(!msgDefined)
                    msgDiv.style.color = "#afaa"; // override color if msg is not defined

                // put message into a text node
                var line = lines[i].replace(/ /g, "\u00a0");
                var msgNode = document.createTextNode(line);
                msgDiv.appendChild(msgNode);

                // new line div with clearing css float property
                var newLineDiv = document.createElement("div");
                newLineDiv.setAttribute("style", "clear:both;");

                logDiv.appendChild(timeDiv);            // add time
                logDiv.appendChild(msgDiv);             // add message
                logDiv.appendChild(newLineDiv);         // add message

                logDiv.scrollTop = logDiv.scrollHeight; // scroll to last line
            }
        },
		
        show: function()
        {
            if(!this.init())
                return;

            if(visible)
                return;

            logDiv.style.visibility = "visible";

            animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideUp);
            function slideUp()
            {
                var duration = Date.now() - animTime;
                if(duration >= animDuration)
                {
                    containerDiv.style.bottom = 0;
                    visible = true;
                    return;
                }
                var y = Math.round(-logHeight * (1 - 0.5 * (1 - Math.cos(Math.PI * duration / animDuration))));
                containerDiv.style.bottom = "" + y + "px";
                requestAnimationFrame(slideUp);
            }
        },
        hide: function()
        {
            if(!this.init())
                return;

            if(!visible)
                return;

            animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideDown);
            function slideDown()
            {
                var duration = Date.now() - animTime;
                if(duration >= animDuration)
                {
                    containerDiv.style.bottom = "" + -logHeight + "px";
                    logDiv.style.visibility = "hidden";
                    visible = false;
                    return;
                }
                var y = Math.round(-logHeight * 0.5 * (1 - Math.cos(Math.PI * duration / animDuration)));
                containerDiv.style.bottom = "" + y + "px";
                requestAnimationFrame(slideDown);
            }
        },
       
        
        clear: function()
        {
            if(!this.init())
                return;

            logDiv.innerHTML = "";
        }
    };
    return self;
})();