/*****************************************************************************************************************************************
 * Fault Tree Viewer for 08240 ACW 2014
 *
 * Misc utility functions
 *
 * Written by Daniel Masterson 446870
 *****************************************************************************************************************************************/

//Help documentation because I'm lazy
function help(bIsInitial)
{
    console.info("Wirecoder Alpha for the Koding Hackathon 2014");
    console.info("Made by team Axon (Daniel Masterson) - https://github.com/koding/global.hackathon/");
    console.info("-----------------------------------------------------------------------------------");
    console.info("&nbsp;");
    console.info("This is the help document for the program, and can be brought up by calling 'help()' in this console.");
    console.info("&nbsp;");
    console.info("Wirecoder is a visual wire and node based scripting tool that allows you to script and generate JavaScript.");
    console.info("While it is in its early stages, there aren't many nodes to chose from, but this should increase over time.");
    console.info("&nbsp;");
    console.info("To begin, drag in a node from the sidebar to the right. Open a category by clicking it, then click and drag a node from the sidebar.");
    console.info("Depending on the node, it will have different types of pins on both the left and right sides of it, differentiated by colour and shape.");
    console.info("You may only connect pins of the same type, or of a supported type, together.");
    console.info("Black triangular pins indicate program flow and are key to program execution.");
    console.info("Purple square nodes are generic var nodes, and can accept and pass to any variable.");
    console.info("Blue square nodes, on the other hand, only function with numberic variables (Or the generic variable).");
    console.info("Square pin's colour match the variable type they are associated to, helping you plan connections.");
    console.info("&nbsp;");
    console.info("To connect nodes together, simply drag from one pin to another.");
    console.info("To move nodes, hold the ctrl key before dragging the node.");
    console.info("Click a node to select it. Its modifiable properties (If any) will display in the bottom right and the node will gain a blue (Or pink) glow.");
    console.info("Changing these properties will change the node directly, and some properties can substitute for pins.");
    console.info("With a node selected, press the 'del' key to delete it.");
    console.info("If a node has errored, it will have a red glow (or pink if selected). You can see its problems in the errors tab.");
    console.info("&nbsp;");
    console.info("Click the play button on the drawer at the bottom, or press space, to run your program.");
    console.info("Click the button or press space again to pause execution, allowing you to step through the code.");
    console.info("Click the step button (Blue play button) or press the 's' key to step.");
    console.info("Click the stop button or press the 'q' key to stop execution.");
    console.info("Any variables will reset to their 'value' property when execution starts again.");
    console.info("&nbsp;");
    console.info("Tips:");
    console.info("-----");
    console.info("&nbsp;");
    console.info("&gt; Tick this isConst property in variables that represent constant values. You won't be able to set them, but the code generation gets a lot nicer.");
    console.info("&gt; ALWAYS link 'flow' nodes to their respective end nodes (If -> EndIf, While -> EndWhile etc) or the program won't run as you expect.");
    console.info("&gt; Directly linking the false pin on If/EndIf nodes will not generate an else block.");
    console.info("&gt; While it is sometimes possible, directly linking to variable pins without an intemediary variable can cause issues.");
    console.info("&nbsp;");
    console.info("Key bindings:");
    console.info("--------------");
    console.info(" space - Run/Pause execution");
    console.info(" q     - Stop execution");
    console.info(" s     - Step execution (When paused)")
    console.info(" r     - Resets camera (Focuses on Main function)");
    console.info(" LMB   - Select node/Drag node if ctrl held down");
    console.info(" del   - Delete selected node");
    console.info(" b     - Toggle breakpoint on selected node");
    console.info(" ctrl  - (Hold down) Drag a node with the mouse instead of selecting it");
    console.info(" 1,2,3 - Selects Console, Error List or Generated Code tab respectively");
    console.info("&nbsp;");
    console.info("&nbsp;");
    if(bIsInitial === true)
    {
        console.warn("If this is the first thing you see, you might want to scroll up.");
        console.info("&nbsp;");
        console.info("&nbsp;");
    }
}

//Resets the camera position and zoom. If bQuick is true, doesn't animate the transition
function ResetCamera(bQuick)
{
	targetPanPosition = new Vector(128, 128);
	targetZoomLevel = 1;
	
	if(bQuick === true)
	{
		actualPanPosition = targetPanPosition.Copy();
		actualZoomLevel = targetZoomLevel;
	}
}

//When the document is resized
function OnResize()
{
	canvas.width = canvas.offsetWidth;
	canvas.height = window.innerHeight - document.getElementById("drawer").offsetHeight;
    canvas.style.height = canvas.height + "px";
}

function SetExecSpeed(el)
{
    _playbackSpeed = el.value;   
}

function RunPauseSimulation()
{
    if(_WCState === 1)
        PauseSimulation();
    else
        RunSimulation();
}

function RunSimulation()
{
    if(lastErrors.length > 0)
    {
        $("#errorListTabBtn").click();
        alert("Cannot run simulation - There are errors!\n\nFix any errors then try running again");
        return;
    }
    
    $(".playPauseBtn").removeClass("playBtn").addClass("pauseBtn");
    $(".stepBtn").removeClass("active");
    
    var playFromNode = _breakpointNode;
    for(var i = 0; i < _workspace.length; i++)
    {
        if(_breakpointNode === undefined)
            _workspace[i].reset();
        _workspace[i].bIsActive = false;
        if(_breakpointNode === undefined && _workspace[i] instanceof MainFunctionNode)
            playFromNode = _workspace[i];
    }
        
    if(playFromNode !== undefined)
    {
        _WCState = 1;
        
        playFromNode.bIsActive = true;
        var oldBreakpoint = playFromNode.bIsBreakpoint; //So people can disable while broken
        playFromNode.bIsBreakpoint = false;
        playFromNode.fire();
        if(playFromNode === _breakpointNode)
        {
            playFromNode.bIsBreakpoint = oldBreakpoint;
            console.info("[" + playFromNode.constructor.name + "@" + playFromNode.getId() + "] Breakpoint resumed");
        }
        else
        {
            console.info("Program simulation begin");   
        }
        
        _breakpointNode = undefined;
    }
}

function StepSimulation()
{
    if(_WCState !== 2)
        return;
    
    if(lastErrors.length > 0)
    {
        $("#errorListTabBtn").click();
        alert("Cannot step simulation - There are errors!\n\nFix any errors then try running again");
        return;
    }
    
    if(_breakpointNode === undefined)
    {
        console.warn("_breakpointNode was undefined while paused/broken");
        return;
    }
            
    _WCState = 1;
    
    _breakpointNode.bIsActive = true;
    var oldBreakpoint = _breakpointNode.bIsBreakpoint; //So people can disable while broken
    _breakpointNode.bIsBreakpoint = false;
    _breakpointNode.fire();  
    _breakpointNode.bIsBreakpoint = oldBreakpoint;
    
    _WCState = 3;
        
    _breakpointNode = undefined;
}

function StopSimulation()
{
    _WCState = 0;
    for(var i = 0; i < _workspace.length; i++)
    {
        _workspace[i].reset();
        _workspace[i].bIsActive = false;
    }
    
    $(".playPauseBtn").removeClass("pauseBtn").addClass("playBtn");
    $(".stepBtn").removeClass("active");
    _breakpointNode = undefined;
    _currentNode = undefined;
    
    console.info("Program simulation stopped");
}

function PauseSimulation(bFocusOnNode, bWasBreak)
{
    var bWasStep = _WCState === 3;
    
    _WCState = 2;
    _breakpointNode = _currentNode;
    SelectNode(_breakpointNode, true);
    
    $(".playPauseBtn").removeClass("pauseBtn").addClass("playBtn");
    $(".stepBtn").addClass("active");
    
    if(bWasStep)
        console.info("[" + _breakpointNode.constructor.name + "@" + _breakpointNode.getId() + "] Stepped");
    else if(bWasBreak === true)
        console.info("[" + _breakpointNode.constructor.name + "@" + _breakpointNode.getId() + "] Breakpoint triggered");
    else
        console.info("[" + _breakpointNode.constructor.name + "@" + _breakpointNode.getId() + "] Paused by user");
}

function SelectNode(node, bFocus)
{
    $("#propArea").empty();
    selectedEl = undefined;
    lastUpdateNode = undefined;
    
    if(!(node instanceof BasicNode))
    {
        if(!(!isNaN(parseInt(node)) && isFinite(node)))
            return;
        
        var nodeID = parseInt(node);
        
        for(var i = 0; i < _workspace.length; i++)
        {
            if(_workspace[i].getId() == nodeID)
            {
                node = _workspace[i];
                break;
            }
        }
    }
      
    lastUpdateNode = selectedEl = node;
    SelectNodeProperties(node);
    
    if(bFocus)
        targetPanPosition = (node.drawPos.Add(node.size.Divide(2)).Subtract(new Vector(canvas.width / 2, canvas.height / 2).Divide(actualZoomLevel))).Multiply(-actualZoomLevel);
}


function DeleteNode(el)
{
    if(el === undefined)
        return;
    
    var index = _workspace.indexOf(selectedEl);
    if(index >= 0)
    {
        _workspace.splice(index, 1);  
    }
    if(el == selectedEl)
        selectedEl = undefined;
    if(el == draggingEl)
        draggingEl = undefined;
    if(el == hoveringEl)
        hoveringEl = undefined;
    
    if(el instanceof BasicNode)
    {
        SelectNode(undefined);
        
        if(el instanceof VarNode)
        {
            for(var i = 0; i < _workspace.length; i++)
            {
                for(var j = 0; j < _workspace[i].inputs.length; j++)
                {
                    if(_workspace[i].inputs[j].connectee !== undefined && _workspace[i].inputs[j].connectee.parent === el)
                    {
                        _workspace[i].inputs[j].connectee = undefined;
                    }
                }
                for(var j = 0; j < _workspace[i].outputs.length; j++)
                {
                    if(_workspace[i].outputs[j].connectee !== undefined && _workspace[i].outputs[j].connectee.parent === el)
                    {
                        _workspace[i].outputs[j].connectee = undefined;
                    }
                }
            }
        }
        else
        {
            for(var i = 0; i < el.inputs.length; i++)
            {
                if(el.inputs[i].connectee !== undefined)
                    el.inputs[i].connectee = el.inputs[i].connectee.connectee = undefined;
            }
            for(var i = 0; i < el.outputs.length; i++)
            {
                if(el.outputs[i].connectee !== undefined)
                    el.outputs[i].connectee = el.outputs[i].connectee.connectee = undefined;
            }
        }
        
        el.onDelete();
    }
}

//Draw a polygon of 'N' sides with a center of x and y and a radius of r
function DrawNPoly(x, y, r, N, rot)
{
    if(rot == undefined)
        rot = 0;
    
    r *= 0.75;
    
	ctx.beginPath();
	ctx.moveTo(x + r * Math.cos(rot - Math.PI / 2 ),
               y + r * Math.sin(rot - Math.PI / 2 ));
	for(var n = 0; n < N; n++)
	{
		ctx.lineTo(x + r * Math.cos(2 * Math.PI * (n / N) - Math.PI / 2 + rot),
				   y + r * Math.sin(2 * Math.PI * (n / N) - Math.PI / 2 + rot));
	}
	ctx.closePath();
}

function DrawRoundedRectangle(x, y, w, h, r)
{
    ctx.moveTo  (x + r,     y);
    ctx.lineTo  (x + w - r, y);
    ctx.arc     (x + w - r, y + r,      r, Math.PI * 3 / 2, 0);
    ctx.lineTo  (x + w,     y + h - r);
    ctx.arc     (x + w - r, y + h - r,  r, 0,               Math.PI / 2);
    ctx.lineTo  (x + r,     y + h);
    ctx.arc     (x + r,     y + h - r,  r, Math.PI / 2,     Math.PI);
    ctx.lineTo  (x,         y + r);
    ctx.arc     (x + r,     y + r,      r, Math.PI,         Math.PI * 3 / 2);
}

//Linearly interpolates between 'a' and 'b' via alpha
function Lerp(a, b, alpha)
{
	return a + (b - a) * alpha;	
}

//Linearly interpolates between color 'a' and 'b' via alpha
function ColorLerp(a, b, alpha)
{
	var aR = 0, aG = 0, aB = 0, aA = 1, bR = 0, bG = 0, bB = 0, bA = 1;
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
		aA = parseFloat(aSplit[3].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
		aA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	if(b.substr(0, 4) == "rgba")
	{
		b = b.substr(4).trim();
		b = b.substr(1, b.length - 2); //Get rid of brackets
		var bSplit = b.split(",");
		bR = parseInt(bSplit[0].trim());
		bG = parseInt(bSplit[1].trim());
		bB = parseInt(bSplit[2].trim());
		bA = parseFloat(bSplit[3].trim());
	}
	else if(b[0] == "#")
	{
		b = parseInt(b.substr(1), 16);
		bR = (b & 0xFF0000) >> 16;
		bG = (b & 0x00FF00) >> 8;
		bB = (b & 0x0000FF);
		bA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	var fR = parseInt(Lerp(aR, bR, alpha));
	var fG = parseInt(Lerp(aG, bG, alpha));
	var fB = parseInt(Lerp(aB, bB, alpha));
	var fA = parseFloat(Lerp(aA, bA, alpha));
	
	return "rgba(" + fR + "," + fG + "," + fB + "," + fA + ")";
}

//Darkens the supplied amount by [alpha] percentage
function ColorDarken(a, alpha)
{
	if(alpha == undefined)
		alpha = 0.8;
		
	var aR = 0, aG = 0, aB = 0, aA = 1;
				
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
		aA = parseFloat(aSplit[3].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
		aA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	aR = parseInt(Math.max(Math.min(aR * alpha, 255), 0));
	aG = parseInt(Math.max(Math.min(aG * alpha, 255), 0));
	aB = parseInt(Math.max(Math.min(aB * alpha, 255), 0));
	
	return "rgba(" + aR + "," + aG + "," + aB + "," + aA + ")";
}

//Lightens the supplied amount by [alpha] percentage
function ColorLighten(a, alpha)
{
	if(alpha == undefined)
		alpha = 0.2;
		
	var aR = 0, aG = 0, aB = 0, aA = 1;
				
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
		aA = parseFloat(aSplit[3].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
		aA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	aR = parseInt(Math.max(Math.min(aR + (255 * alpha), 255), 0));
	aG = parseInt(Math.max(Math.min(aG + (255 * alpha), 255), 0));
	aB = parseInt(Math.max(Math.min(aB + (255 * alpha), 255), 0));
	
	return "rgba(" + aR + "," + aG + "," + aB + "," + aA + ")";
}

function SetOpacity(a, opacity)
{
    if(opacity == undefined)
		opacity = 0.8;
		
	var aR = 0, aG = 0, aB = 0, aA = 1;
				
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
	}
	else
	{
		return a; //Can't parse color
	}

    aA = opacity;
    
	return "rgba(" + aR + "," + aG + "," + aB + "," + aA + ")";
}

String.prototype.padLeft = function(len, chr)
{
    var str = this, chr = chr || " ", len = len || 0;
    while(str.length < len) str = chr + str;
    return str;
}

String.prototype.addLeft = function(len, chr)
{
    var str = this, chr = chr || " ", len = len || 0;
    for(var i = 0; i < len; i++) str = chr + str;
    return str;
}
