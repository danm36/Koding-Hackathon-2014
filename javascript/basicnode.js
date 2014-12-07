/*****************************************************************************************************************************************
 * WireCoder
 *
 * Main basic node logic file
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var BasicNode = (function()
{
    BasicNode.sTotalNodes = 0;
    
    sidebar.AddToSidebar("BasicNode", "Relay", "Basic");
    function BasicNode(spawnPos)
	{
        this.setId(BasicNode.sTotalNodes++);
		this.myFillColor = styleData.nodeFill;
        this.hoverTimer = 0;
        this.drawPos = spawnPos === undefined ? new Vector(0, 0) : spawnPos;
        this.size = new Vector(128, 64);
        this.inputs = new Array();
        this.outputs = new Array();
        this.bIsActive = false;
        this.properties = { };
        this.bIsBreakpoint = false;
        
        this.curError = undefined;
        
        this.onCreate();
        this.reset();
    }
    
    BasicNode.prototype.onCreate = function()
    {
        this.displayName = "Relay";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    BasicNode.prototype.onDelete = function() { }
		
    BasicNode.prototype.getId = function()
	{
        return this.mId;
    };
	
    BasicNode.prototype.setId = function(pId)
	{
        this.mId = pId;
    };
    
    BasicNode.prototype.fire = function(params)
    {
        if(_WCState !== 1)
        {
            this.bIsActive = false;
            return;
        }
        
        _currentNode = this;
        this.bIsActive = true;
        
        if(_jumpingbackto !== undefined)
        {
            if(_jumpingbackto !== this.constructor.name)
            {
                this.inputs[0].fire();
                this.bIsActive = false;
                return;
            }
             _jumpingbackto = undefined;
            this.justJumpedTo = true;
        }
        
        if(_jumpingto !== undefined)
        {
            if(_jumpingto !== this.constructor.name)
            {
                this.outputs[0].fire(true);
                this.bIsActive = false;
                return;
            }
             _jumpingto = undefined; 
            this.justJumpedTo = true;
        } 
        
        if(this.bIsBreakpoint && _breakpointNode === undefined)
        {
            _WCState = 2;
            SelectNode(this, true);
            _breakpointNode = this;
            console.info("[" + this.constructor.name + "@" + this.getId() + "] Breakpoint triggered");
            return;
        }
        
        var self = this;
        setTimeout(function()
        {
            self.execute(params);
            self.justJumpedTo = false;
        }, _playbackSpeed);
    }
    
    BasicNode.prototype.execute = function()
    {
        this.outputs[0].fire();
    }
        
    BasicNode.prototype.getValue = function(pin)
    {
        if(pin instanceof NodePin && pin.connectee !== undefined)
            return pin.connectee.parent.getValue(undefined) || pin.connectee.lastValue;
        return undefined;
    }
    
    BasicNode.prototype.setValue = function(pin, value)
    {
        if(pin instanceof NodePin && pin.connectee !== undefined)
        {
            pin.lastValue = value;
            pin.connectee.parent.setValue(undefined, value);
        }
    }
		
    BasicNode.prototype.reset = function() { }
    
    BasicNode.prototype.onMouseUp = function()
    {
        if(mousePosition.x > this.drawPos.x + 2 && mousePosition.y > this.drawPos.y + 2 &&
           mousePosition.x < this.drawPos.x + 18 && mousePosition.y < this.drawPos.y + 20)
        {
            this.bIsBreakpoint = !this.bIsBreakpoint;
            return true;
        }
        
        return false;
    }
    
	BasicNode.prototype.update = function()
    {	
        if(!(this instanceof VarNode))
            this.reset();
        
        if(draggingEl === this && ctrlDownOnDrag)
        {
            this.drawPos = mousePosition.Copy().Subtract(this.size.Divide(2));
        }
        
        var bHoveringOnPin = false;
        
        for(var i = 0; i < this.inputs.length; i++)
        {
            this.inputs[i].update(new Vector(this.drawPos.x - 8, this.drawPos.y + 24 + i * 24));
            if(hoveringEl === this.inputs[i])
                bHoveringOnPin = true;
        }
        
        for(var i = 0; i < this.outputs.length; i++)
        {
            this.outputs[i].update(new Vector(this.drawPos.x + this.size.x - 8, this.drawPos.y + 24 + i * 24), true);
            if(hoveringEl === this.outputs[i])
                bHoveringOnPin = true;
        }
        
		if(draggingEl === undefined && !bHoveringOnPin)
		{
			if(	mousePosition instanceof Vector && 
				mousePosition.x > this.drawPos.x && mousePosition.x < this.drawPos.x + this.size.x &&
				mousePosition.y > this.drawPos.y && mousePosition.y < this.drawPos.y + this.size.y)
			{
				this.bIsHovering = true;
				hoveringEl = this;
			}
			else
			{
				this.bIsHovering = false;
				if(hoveringEl == this)
					hoveringEl = undefined;
			}
		}
          
        if(hoveringEl == this)
        {
            this.hoverTimer += 0.05; //Because I can't be bothered to work out a delta time - Not critical for what this is being used for
            if(this.hoverTimer > 1)
                this.hoverTimer = 1;
        }
        else
        {
            this.hoverTimer -= 0.05; //Because I can't be bothered to work out a delta time - Not critical for what this is being used for
            if(this.hoverTimer < 0)
                this.hoverTimer = 0;
        }
				
        //Sets the fill color based on hovering and simulation mode. Lerped for a quick smooth animation
		this.myFillColor = ColorLerp(this.myFillColor, ColorDarken(this.bIsActive ? styleData.nodeFillActive : styleData.nodeFill, this.bIsHovering ? 0.8 : 1), 0.2);
        
        ctx.font = "10pt Trebuchet MS";
        ctx.fillStyle = "#000000";
        var stringSize = ctx.measureText(this.displayName);
        this.size.x = Math.max(stringSize.width + 32, 128);
        
        var largerIO = Math.max(this.inputs.length, this.outputs.length) - 1;
        this.size.y = 64 + 24 * largerIO;
    };
	
	BasicNode.prototype.draw = function(bDontClip)
	{        
		//Bounds checking so we can avoid expensive bezier or circle drawing
		//bDontClip stops minimap clipping
        if( bDontClip !== true && (
			(this.drawPos.x + this.size.x) * actualZoomLevel 	< -actualPanPosition.x ||
			(this.drawPos.x * actualZoomLevel) - canvas.width 	> -actualPanPosition.x ||
			(this.drawPos.y + this.size.y) * actualZoomLevel 	< -actualPanPosition.y ||
			(this.drawPos.y * actualZoomLevel) - canvas.height 	> -actualPanPosition.y))
		  return;
        
        ctx.fillStyle = this.myFillColor;
        ctx.strokeStyle = styleData.nodeStroke;
        
        if(selectedEl == this && !mouseDown)
        {
            ctx.shadowColor = this.curError !== undefined ? styleData.nodeSelectionErrorGlow : styleData.nodeSelectionGlow;
            ctx.shadowBlur = 20;
        }
        else if(this.curError !== undefined)
        {
            ctx.shadowColor = styleData.nodeErrorGlow;
            ctx.shadowBlur = 20;
        }
        
        ctx.beginPath();
        DrawRoundedRectangle(this.drawPos.x, this.drawPos.y, this.size.x, this.size.y, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        //Breakpoint indicator
        if(!(this instanceof MainFunctionNode))
        {
            ctx.beginPath();
            ctx.fillStyle = this.bIsBreakpoint ? styleData.nodeBreakpointActive : styleData.nodeBreakpointInactive;
            ctx.strokeStyle = "#000000";
            ctx.arc(this.drawPos.x + 10, this.drawPos.y + 12, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.font = "10pt Trebuchet MS";
        ctx.fillStyle = "#000000";
        ctx.fillText(this.displayName, this.drawPos.x + this.size.x / 2 - ctx.measureText(this.displayName).width / 2, this.drawPos.y + 16); 
        
        for(var i = 0; i < this.inputs.length; i++)
            this.inputs[i].draw();
        
        for(var i = 0; i < this.outputs.length; i++)
            this.outputs[i].draw();
    };
    
    BasicNode.prototype.drawConnectingLines = function()
    {
        for(var i = 0; i < this.inputs.length; i++)
            this.inputs[i].drawConnectingLines();
        
        for(var i = 0; i < this.outputs.length; i++)
            this.outputs[i].drawConnectingLines();
    }
    		
    return BasicNode;
})();


var NodePin = (function()
{
    function NodePin(parent, label, type, bIsVarNode)
	{
        this.setId(NodePin.sTotalNodes++);
        this.myFillColor = "#000000";
        this.parent = parent;
        this.label = label || "";
        this.type = type.toLowerCase();
        this.radius = 16;
        this.bIsVarNode = bIsVarNode;
        
        var otherTypes = nodePinTypeSupports[this.type] || new Array();
        otherTypes.push(type);
        this.supportedTypes = otherTypes;
        
        this.lastValue = undefined;
        this.connectee = undefined;
    }

	
	NodePin.sTotalNodes = 0;
    NodePin.prototype.getId = function()
	{
        return this.mId;
    };
	
    NodePin.prototype.setId = function(pId)
	{
        this.mId = pId;
    };
    
    NodePin.prototype.onMouseDown = function()
    {
        if(this.connectee !== undefined)
            this.connectee.connectee = undefined;
        this.connectee = undefined;
    }
    
    NodePin.prototype.onMouseUp = function()
    {
        for(var i = 0; i < _workspace.length; i++)
        {
            if(_workspace[i] instanceof BasicNode && _workspace[i] !== this.parent)
            {
                if(this.bIsVarNode)
                {
                    for(var j = 0; j < _workspace[i].inputs.length; j++)
                    {
                        if( _workspace[i].inputs[j].supportedTypes.indexOf(this.type) >= 0 &&
                            mousePosition.x > _workspace[i].inputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].inputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].inputs[j].drawPos.x + _workspace[i].inputs[j].radius &&
                            mousePosition.y < _workspace[i].inputs[j].drawPos.y + _workspace[i].inputs[j].radius)
                        {
                            if(_workspace[i].inputs[j].connectee !== undefined)
                                _workspace[i].inputs[j].connectee.connectee = undefined;
                            _workspace[i].inputs[j].connectee = this;
                            return;
                        }
                    }
                    for(var j = 0; j < _workspace[i].outputs.length; j++)
                    {                        
                        if( this.supportedTypes.indexOf(_workspace[i].outputs[j].type) >= 0 &&
                            mousePosition.x > _workspace[i].outputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].outputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].outputs[j].drawPos.x + _workspace[i].outputs[j].radius &&
                            mousePosition.y < _workspace[i].outputs[j].drawPos.y + _workspace[i].outputs[j].radius)
                        {
                            if(_workspace[i].outputs[j].connectee !== undefined)
                                _workspace[i].outputs[j].connectee.connectee = undefined;
                            _workspace[i].outputs[j].connectee = this;
                            return;
                        }
                    }
                }
                if(this.isOutput)
                {
                    for(var j = 0; j < _workspace[i].inputs.length; j++)
                    {
                        if( _workspace[i].inputs[j].supportedTypes.indexOf(this.type) >= 0 &&
                            mousePosition.x > _workspace[i].inputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].inputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].inputs[j].drawPos.x + _workspace[i].inputs[j].radius &&
                            mousePosition.y < _workspace[i].inputs[j].drawPos.y + _workspace[i].inputs[j].radius)
                        {
                            
                            this.connectee = _workspace[i].inputs[j];
                            if(!this.connectee.bIsVarNode)
                            {
                                if(this.connectee.connectee !== undefined)
                                    this.connectee.connectee.connectee = undefined;
                                this.connectee.connectee = this;
                            }
                            return;
                        }
                    }
                }
                else
                {
                    for(var j = 0; j < _workspace[i].outputs.length; j++)
                    {                        
                        if( this.supportedTypes.indexOf(_workspace[i].outputs[j].type) >= 0 &&
                            mousePosition.x > _workspace[i].outputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].outputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].outputs[j].drawPos.x + _workspace[i].outputs[j].radius &&
                            mousePosition.y < _workspace[i].outputs[j].drawPos.y + _workspace[i].outputs[j].radius)
                        {
                            this.connectee = _workspace[i].outputs[j];
                            if(!this.connectee.bIsVarNode)
                            {
                                if(this.connectee.connectee !== undefined)
                                    this.connectee.connectee.connectee = undefined;
                                this.connectee.connectee = this;
                            }
                            return;
                        }
                    }
                }
            }
        }
    }
		
    NodePin.prototype.fire = function()
    {
        if(this.isOutput)
        {
            if(this.connectee !== undefined)
            {
                this.connectee.fire(); 
            }
            else
            {
                if(CallFunctionNode.waitStack.length > 0)
                    CallFunctionNode.waitStack.pop().execute(true);
                else
                    _WCState = 0;   
                
            }
            this.parent.bIsActive = false;
        }
        else
        {
            if(_jumpingbackto !== undefined)
            {
                this.connectee.parent.fire();
            }
            else
            {
                this.parent.bIsActive = true;
                this.parent.fire();         
            }
        }
    }

	NodePin.prototype.update = function(drawPos, bIsOutput)
    {	
        this.drawPos = drawPos;
        this.isOutput = bIsOutput;
        
		if(draggingEl === undefined)
		{
			if(	mousePosition instanceof Vector && 
				mousePosition.x > this.drawPos.x && mousePosition.x < this.drawPos.x + this.radius &&
				mousePosition.y > this.drawPos.y && mousePosition.y < this.drawPos.y + this.radius)
			{
				this.bIsHovering = true;
				hoveringEl = this;
			}
			else
			{
				this.bIsHovering = false;
				if(hoveringEl == this)
					hoveringEl = undefined;
			}
		}
        
        if(hoveringEl == this)
        {
            this.hoverTimer += 0.05; //Because I can't be bothered to work out a delta time - Not critical for what this is being used for
            if(this.hoverTimer > 1)
                this.hoverTimer = 1;
        }
        else
        {
            this.hoverTimer -= 0.05; //Because I can't be bothered to work out a delta time - Not critical for what this is being used for
            if(this.hoverTimer < 0)
                this.hoverTimer = 0;
        }
				
        //Sets the fill color based on hovering and simulation mode. Lerped for a quick smooth animation
		this.myFillColor = ColorLerp(this.myFillColor, ColorLighten(styleData.pinFillColor[this.type] || "#000000", this.bIsHovering ? 0.5 : 0), 0.2);
    };
	
	NodePin.prototype.draw = function()
	{             
        ctx.fillStyle = ctx.strokeStyle = this.myFillColor;      
        
        ctx.beginPath();
        
        if(this.type == "flow")
        {
            DrawNPoly(this.drawPos.x + this.radius / 2, this.drawPos.y + this.radius / 2, this.radius, 3, Math.PI / 2);                
        }
        else
        {
            ctx.rect(this.drawPos.x, this.drawPos.y, this.radius, this.radius);
        }
        
        ctx.stroke();
        if(this.connectee === undefined)
            ctx.fillStyle = SetOpacity(ctx.fillStyle, 0.3);
        ctx.fill();
        
        ctx.font = "8pt Trebuchet MS";
        ctx.fillStyle = "#000000";
        var stringWidth = ctx.measureText(this.label);
        
        if(this.isOutput)
            ctx.fillText(this.label, this.drawPos.x - stringWidth.width - 8, this.drawPos.y + 12); 
        else
            ctx.fillText(this.label, this.drawPos.x + this.radius + 8, this.drawPos.y + 12); 
    };
    
    NodePin.prototype.drawConnectingLines = function()
    {
        var lineEndPoint = undefined;
        if(draggingEl === this)
        {
            lineEndPoint = mousePosition.Copy();            
        }
        else if(this.connectee !== undefined && ((!this.bIsVarNode && this.isOutput) || this.connectee.bIsVarNode))
        {
            lineEndPoint = this.connectee.drawPos.Copy().Add(new Vector(this.connectee.radius / 2, this.connectee.radius / 2));
        }
        
        if(lineEndPoint !== undefined)
        {
            ctx.strokeStyle = styleData.pinFillColor[this.type] || "#000000";
            
            var controlPoint1 = new Vector(this.isOutput ?
                                           this.drawPos.x + this.radius / 2 + Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x + 48), 256), 64) :
                                           this.drawPos.x + this.radius / 2 - Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x), 256), 64),
                                           Lerp(this.drawPos.y + this.radius / 2, lineEndPoint.y, 0.05));
            var controlPoint2 = new Vector(this.isOutput ?
                                           lineEndPoint.x - Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x + 48), 256), 64) :
                                           lineEndPoint.x + Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x), 256), 64),
                                           Lerp(this.drawPos.y + this.radius / 2, lineEndPoint.y, 0.95));
            ctx.beginPath();
            ctx.moveTo(this.drawPos.x + this.radius / 2, this.drawPos.y + this.radius / 2);
            ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y,
                              controlPoint2.x, controlPoint2.y,
                              lineEndPoint.x, lineEndPoint.y);
            ctx.stroke();
        }
    }
    		
    return NodePin;
})();
