/*****************************************************************************************************************************************
 * WireCoder
 *
 * Main canvas logic file
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

window.addEventListener = window.addEventListener || window.attachEvent || undefined;

if(window.addEventListener) //Check for browser compatability
	window.addEventListener('load', onLoad, false );
else
	alert("Your browser cannot run this tool");

function onLoad()
{
	function Init()
	{
		canvas = document.getElementById("canvas");
		if(!canvas)
		{
			alert("Error: Canvas does not exist");
			return false;
		}
		
		if(!canvas.getContext)
		{
			alert("Error: No canvas.getContext");
			return false;
		}
		
		ctx = canvas.getContext("2d");
		if(!ctx)
		{
			alert("Error: Failed to get the 2D canvas context");
			return false;
		}
		
		mousePosition = new Vector(0, 0);
		        
		canvas.addEventListener('mousemove', function(e)
		{
			var rect = canvas.getBoundingClientRect();
			var newMousePosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);
			
            if(draggingEl === undefined && actualMousePosition.x > canvas.width - sidebar.width)
            {
                sidebar.mouseMove(e, newMousePosition);
                actualMousePosition = newMousePosition;
                return;
            }
            
            if(mouseDown)
            {
                if(selectedEl !== undefined && mouseDownPosition.Subtract(newMousePosition).LengthSquared() > 64)
                {
                    draggingEl = selectedEl;
                    selectedEl = undefined;
                }
            
                if(selectedEl === undefined && draggingEl === undefined)
                {
                    actualPanPosition = actualPanPosition.Subtract(actualMousePosition.Subtract(newMousePosition));
				    targetPanPosition = actualPanPosition.Copy();
                }
            }
			
			actualMousePosition = newMousePosition;
            mousePosition = actualMousePosition.Subtract(actualPanPosition).Divide(actualZoomLevel);
		});
		
        window.addEventListener('mousedown', function(e)
        {
            lastMouseDownElement = e.target;
        });
        lastMouseDownElement = canvas;
        
		canvas.addEventListener('mousedown', function(e)
		{
            var rect = canvas.getBoundingClientRect();
			mouseDownPosition = new Vector(e.clientX - rect.left, e.clientY - rect.top);       
			mouseDown = true;
            
            if(draggingEl === undefined && actualMousePosition.x > canvas.width - sidebar.width)
            {
                sidebar.mouseDown(e);
                return;
            }
                      
            selectedEl = undefined;
            if(hoveringEl !== undefined)
            {
                selectedEl = hoveringEl;
                hoveringEl = undefined;
                if(selectedEl.onMouseDown !== undefined)
                    selectedEl.onMouseDown();
            }
            
            if(ctrlDownOnDrag)
            {
                draggingEl = selectedEl;
                selectedEl = undefined;
            }
		});
		
		canvas.addEventListener('mouseup', function(e)
		{				
			mouseDown = false;
            ctrlDownOnDrag = false;
            
            if(draggingEl === undefined && actualMousePosition.x > canvas.width - sidebar.width)
            {
                sidebar.mouseUp(e);
                return;
            }
            
            if(selectedEl !== undefined)
            {
                if(selectedEl instanceof NodePin)
                    SelectNode(selectedEl.parent);
                if(selectedEl.onMouseUp() !== true)
                    SelectNode(selectedEl);
                else
                    SelectNode(undefined);
            }
            else
                SelectNode(undefined);
            
            if(draggingEl !== undefined)
            {
                if(draggingEl.onMouseUp !== undefined)
                    draggingEl.onMouseUp();
                draggingEl = undefined;
            }
		});
		
		canvas.addEventListener("mousewheel", function(e)
		{
			var delta = e.wheelDelta || -e.detail;
			delta /= 1200; //In testing, wheelDelta has always been a factor of 120 for me, so this value works nicely
			
            if(draggingEl === undefined && actualMousePosition.x > canvas.width - sidebar.width)
            {
                sidebar.scrollTop -= delta * 256;
                return;
            }
            
			var oldZoom = targetZoomLevel;
			
			targetZoomLevel += delta;
			if(targetZoomLevel > 5)
				targetZoomLevel = 5;
			else if(targetZoomLevel < 0.1)
				targetZoomLevel = 0.1;
				
			targetPanPosition = targetPanPosition.Subtract(actualMousePosition).Divide(oldZoom).Multiply(targetZoomLevel).Add(actualMousePosition); //Zooms at the mouse cursor
		});
		
		window.addEventListener('keydown', function(e)
		{
            if(lastMouseDownElement !== canvas)
                return;
            
			switch(e.which)
			{
                case 17: //[ctrl] - Allows node dragging
                    if(!mouseDown)
                        ctrlDownOnDrag = true;
                    break;
                case 32: //[space] - Run/Pause simulation
                    RunPauseSimulation();
					break;
                case 46: //[del] - Delete selected node
                    if(selectedEl instanceof MainFunctionNode)
                        break;
                    
                    DeleteNode(selectedEl);
                    break;
                case 66: //[b] - Toggle breakpoint
                    if(selectedEl !== undefined && !(selectedEl instanceof MainFunctionNode))
                        selectedEl.bIsBreakpoint = !selectedEl.bIsBreakpoint;
                    break;
                case 81: //[q] - Stop
                    StopSimulation();
                    break;  
                case 82: //[r] - Reset camera
                    ResetCamera();
                    break;
                case 83: //[s] - Step
                    StepSimulation();
                    break;
                    
                //Temp
                
                case 49: //[1] - Console tab
                    $("#consoleTabBtn").click();
                    break;
                case 50: //[2] - Errors tab
                    $("#errorListTabBtn").click();
                    break;
                case 51: //[3] - Generated code tab
                    $("#generatedCodeTabBtn").click();
                    break;
			}
            
            console.log(e.which);
		});
        
        window.addEventListener('keyup', function(e)
		{
           switch(e.which)
           {
               case 17:
                   if(!mouseDown)
                       ctrlDownOnDrag = false;
                   break; 
           }
        });
		
		window.addEventListener('resize', OnResize, false); //Because OnResize - like RecalcTree can be used usefully elsewhere
		
		OnResize();
		
		ResetCamera(true);
		
		return true;
	}
    
	Init();
	Draw();
    
    help(true);    
    
    _workspace.push(new MainFunctionNode());
}

function Draw()
{
	ctx.lineWidth = 1;
	ctx.setTransform(1, 0, 0, 1, 0, 0); //Reset transformations back to the origin
	ctx.globalCompositeOperation = "source-over"; //Resets blend mode
		
	styleData.bgFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
	if(_WCState == 1) //Handle color interp
	{
		styleData.bgGradTopInterp = ColorLerp(styleData.bgGradTopInterp, styleData.bgGradTopSimu, 0.2);
		styleData.bgGradBotInterp = ColorLerp(styleData.bgGradBotInterp, styleData.bgGradBotSimu, 0.2);
	}
	else if(_WCState == 2)
	{
		styleData.bgGradTopInterp = ColorLerp(styleData.bgGradTopInterp, styleData.bgGradTopBreak, 0.2);
		styleData.bgGradBotInterp = ColorLerp(styleData.bgGradBotInterp, styleData.bgGradBotBreak, 0.2);
	}
	else
	{
		styleData.bgGradTopInterp = ColorLerp(styleData.bgGradTopInterp, styleData.bgGradTopNorm, 0.2);
		styleData.bgGradBotInterp = ColorLerp(styleData.bgGradBotInterp, styleData.bgGradBotNorm, 0.2);
	}
	styleData.bgFill.addColorStop(0, styleData.bgGradTopInterp);
	styleData.bgFill.addColorStop(1, styleData.bgGradBotInterp);

    ctx.fillStyle = styleData.bgFill;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//Lerp pan and zoom positions for smooth motion
	actualPanPosition = actualPanPosition.Lerp(targetPanPosition, 0.1);
	actualZoomLevel = Lerp(actualZoomLevel, targetZoomLevel, 0.1);
		
	//Scale into the actual draw region
	ctx.translate(actualPanPosition.x, actualPanPosition.y);
	ctx.scale(actualZoomLevel, actualZoomLevel);
	
    for(var i = 0; i < _workspace.length; i++) //Initial draw
    {
        if(_workspace[i] === undefined)
        {
            _workspace.splice(i, 1);
            i--;
            continue;
        }
        
        _workspace[i].update();
        if(_workspace[i].curError !== undefined)
            AddError(_workspace[i], _workspace[i].curError);
        if(!(_workspace[i] instanceof VarNode))
            _workspace[i].draw();
        
        _workspace[i].drawConnectingLines();
    }
      
    for(var i = 0; i < _workspace.length; i++) //Draw var nodes above everything else
    {
        if(_workspace[i] instanceof VarNode)
            _workspace[i].draw();
    }
    
    CheckForNewErrors();
    
    document.getElementById("canvas").className = "";
    if(mouseDown && !(draggingEl instanceof NodePin))
		$("#canvas").addClass("cursorDrag");
    if(hoveringEl !== undefined || draggingEl instanceof NodePin)
        $("#canvas").addClass("cursorHover");

    sidebar.UpdateSidebar();
    sidebar.DrawSidebar();
    
    //A little watermark
	ctx.font = "10pt Trebuchet MS";
	ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	ctx.fillText("WireCoder Alpha by Daniel Masterson", 4, 12);
							
	window.requestAnimationFrame(Draw);
}