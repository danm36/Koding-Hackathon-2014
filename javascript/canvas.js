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
			
            if(draggingEl !== undefined)
            {
                
            }
            else
            {
                if(mouseDown)
                {
                    actualPanPosition = actualPanPosition.Subtract(actualMousePosition.Subtract(newMousePosition));
				    targetPanPosition = actualPanPosition.Copy();
                }
            }
			
			actualMousePosition = newMousePosition;
            mousePosition = actualMousePosition.Subtract(actualPanPosition).Divide(actualZoomLevel);
		});
		
		canvas.addEventListener('mousedown', function(e)
		{
			mouseDown = true;
            
            if(hoveringEl !== undefined)
            {
                draggingEl = hoveringEl;
                hoveringEl = undefined;
                if(draggingEl.onMouseDown !== undefined)
                    draggingEl.onMouseDown();
            }
		});
		
		canvas.addEventListener('mouseup', function(e)
		{				
			mouseDown = false;
            
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
			switch(e.which)
			{
                case 70: //[f] - Reset camera
                    ResetCamera();
                    break;
				case 82: //[r] - Run simulation
                    for(var i = 0; i < _workspace.length; i++)
                    {
                        if(_workspace[i] instanceof MainFunctionNode)
                        {
                            _workspace[i].bIsActive = true;
                            _workspace[i].fire();
                            break;
                        }
                    }
					break;
			}
            
            console.log(e.which);
		});
		
		window.addEventListener('resize', OnResize, false); //Because OnResize - like RecalcTree can be used usefully elsewhere
		
		OnResize();
		
		ResetCamera(true);
		
		return true;
	}
	Init();
	Draw();
    
    _workspace.push(new MainFunctionNode());
    _workspace.push(new BasicNode(new Vector(256, 0)));
    _workspace.push(new BasicNode(new Vector(512, 0)));         
    _workspace.push(new ConsoleLogNode(new Vector(256, 128)));         
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
		styleData.bgGradTopInterp = ColorLerp(styleData.bgGradTopInterp, styleData.bgGradTopEdit, 0.2);
		styleData.bgGradBotInterp = ColorLerp(styleData.bgGradBotInterp, styleData.bgGradBotEdit, 0.2);
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
	
	//A little watermark
	ctx.font = "10pt Trebuchet MS";
	ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
	ctx.fillText("WireCoder Beta - Daniel Masterson", canvas.width - 212, canvas.height - 4);
	
	//Lerp pan and zoom positions for smooth motion
	actualPanPosition = actualPanPosition.Lerp(targetPanPosition, 0.1);
	actualZoomLevel = Lerp(actualZoomLevel, targetZoomLevel, 0.1);
		
	//Scale into the actual draw region
	ctx.translate(actualPanPosition.x, actualPanPosition.y);
	ctx.scale(actualZoomLevel, actualZoomLevel);
	
    
    for(var i = 0; i < _workspace.length; i++) //Initial draw
    {
        _workspace[i].update();
        _workspace[i].draw();
    }
    
    for(var i = 0; i < _workspace.length; i++) //Lines connecting pins
    {
        _workspace[i].drawConnectingLines();
    }
    
    document.getElementById("canvas").className = "";
    if(mouseDown)
		document.getElementById("canvas").className += " cursorDrag";
    if(hoveringEl !== undefined)
        document.getElementById("canvas").className += " cursorHover";	


							
	window.requestAnimationFrame(Draw);
}