/*****************************************************************************************************************************************
 * Fault Tree Viewer for 08240 ACW 2014
 *
 * Misc utility functions
 *
 * Written by Daniel Masterson 446870
 *****************************************************************************************************************************************/

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

function RunSimulation()
{
    if(lastErrors.length > 0)
    {
        $("#errorListTabBtn").click();
        alert("Cannot run simulation - There are errors!\n\nFix any errors then try running again");
        return;
    }
    
    var playFromNode = _breakpointNode;
    for(var i = 0; i < _workspace.length; i++)
    {
        _workspace[i].reset();
        _workspace[i].bIsActive = false;
        if(_breakpointNode === undefined && _workspace[i] instanceof MainFunctionNode)
            playFromNode = _workspace[i];
    }
        
    if(playFromNode !== undefined)
    {
        _WCState = 1;
        
        playFromNode.bIsActive = true;
        playFromNode.bIsBreakpoint = false;
        playFromNode.fire();
        if(playFromNode === _breakpointNode)
        {
            playFromNode.bIsBreakpoint = true;
            console.info("[" + playFromNode.constructor.name + "@" + playFromNode.getId() + "] Breakpoint resumed");
        }
        else
        {
            console.info("Program simulation begin");   
        }
        
        _breakpointNode = undefined;
    }
}

function StopSimulation()
{
    _WCState = 0;
    for(var i = 0; i < _workspace.length; i++)
    {
        _workspace[i].reset();
        _workspace[i].bIsActive = false;
    }
    console.info("Program simulation stopped");
}

function PauseSimulation(bFocusOnNode)
{
    _WCState = 2;
    _breakpointNode = _currentNode;
    SelectNode(_breakpointNode, true);
    console.info("[" + _breakpointNode.constructor.name + "@" + this.getId() + "] Paused by user");
}

function SelectNode(node, bFocus)
{
    $("#propArea").empty();
    selectedEl = undefined;

    
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
        
    selectedEl = node;
    SelectNodeProperties(node);
    
    if(bFocus)
        targetPanPosition = node.drawPos.Add(node.size.Divide(2)).Multiply(-1).Add(new Vector(canvas.width / 2 - sidebar.width / 2, canvas.height / 2));
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
