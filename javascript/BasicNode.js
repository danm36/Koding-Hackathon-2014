/*****************************************************************************************************************************************
 * WireCoder
 *
 * Main basic node logic file
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var BasicNode = (function()
{
    function BasicNode(spawnPos)
	{
        this.setId(BasicNode.sTotalNodes++);
		this.myFillColor = styleData.nodeFill;
        this.hoverTimer = 0;
        this.drawPos = spawnPos === undefined ? new Vector(0, 0) : spawnPos;
        this.size = new Vector(128, 64);
        this.inputs = new Array();
        this.outputs = new Array();
        this.onCreate();
        this.bIsActive = false;
    }
    
    BasicNode.prototype.onCreate = function()
    {
        this.displayName = "Relay";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
	
	BasicNode.sTotalNodes = 0;
    BasicNode.prototype.getId = function()
	{
        return this.mId;
    };
	
    BasicNode.prototype.setId = function(pId)
	{
        this.mId = pId;
    };
    
    BasicNode.prototype.fire = function()
    {
        var self = this;
        setTimeout(function()
        {
            self.execute();
        }, 100);
    }
    
    BasicNode.prototype.execute = function()
    {
        this.outputs[0].fire();
    }
		
	BasicNode.prototype.update = function()
    {	
        if(draggingEl === this)
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
        this.size.x = Math.max(stringSize.width + 16, 128);
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
        
        ctx.beginPath();
        ctx.moveTo(this.drawPos.x + 16, this.drawPos.y);
        ctx.lineTo(this.drawPos.x + this.size.x - 16, this.drawPos.y);
        ctx.arc(this.drawPos.x + this.size.x - 16, this.drawPos.y + 16, 16, Math.PI * 3 / 2, 0);
        ctx.lineTo(this.drawPos.x + this.size.x, this.drawPos.y + this.size.y - 16);
        ctx.arc(this.drawPos.x + this.size.x - 16, this.drawPos.y + this.size.y - 16, 16, 0, Math.PI / 2);
        ctx.lineTo(this.drawPos.x + 16, this.drawPos.y + this.size.y);
        ctx.arc(this.drawPos.x + 16, this.drawPos.y + this.size.y - 16, 16, Math.PI / 2, Math.PI);
        ctx.lineTo(this.drawPos.x, this.drawPos.y + 16);
        ctx.arc(this.drawPos.x + 16, this.drawPos.y + + 16, 16, Math.PI, Math.PI * 3 / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
        ctx.strokeStyle = "#000000";
        for(var i = 0; i < this.inputs.length; i++)
            this.inputs[i].drawConnectingLines();
        
        for(var i = 0; i < this.outputs.length; i++)
            this.outputs[i].drawConnectingLines();
    }
    		
    return BasicNode;
})();


var NodePin = (function()
{
    function NodePin(parent, label, type, otherSupportedTypes)
	{
        this.setId(NodePin.sTotalNodes++);
        this.myFillColor = "#000000";
        this.parent = parent;
        this.label = label || "";
        this.type = type;
        if(!(otherSupportedTypes instanceof Array))
            otherSupportedTypes = new Array();
        otherSupportedTypes.push(type);
        this.supportedTypes = otherSupportedTypes;
        
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
                if(this.isOutput)
                {
                    for(var j = 0; j < _workspace[i].inputs.length; j++)
                    {
                        if( this.supportedTypes.indexOf(_workspace[i].inputs[j].type) >= 0 &&
                            mousePosition.x > _workspace[i].inputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].inputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].inputs[j].drawPos.x + 16 &&
                            mousePosition.y < _workspace[i].inputs[j].drawPos.y + 16)
                        {
                            this.connectee = _workspace[i].inputs[j];
                            if(this.connectee.connectee !== undefined && this.connectee.connectee.connectee !== this)
                                this.connectee.connectee.connectee = undefined;
                            this.connectee.connectee = this;
                            return;
                        }
                    }
                }
                else
                {
                    for(var j = 0; j < _workspace[i].outputs.length; j++)
                    {                        
                        if( mousePosition.x > _workspace[i].outputs[j].drawPos.x &&
                            mousePosition.y > _workspace[i].outputs[j].drawPos.y &&
                            mousePosition.x < _workspace[i].outputs[j].drawPos.x + 16 &&
                            mousePosition.y < _workspace[i].outputs[j].drawPos.y + 16)
                        {
                            this.connectee = _workspace[i].outputs[j];
                            if(this.connectee.connectee !== undefined && this.connectee.connectee.connectee !== this)
                                this.connectee.connectee.connectee = undefined;
                            this.connectee.connectee = this;
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
                this.connectee.fire(); 
            else
                _WCState = 0;   
            this.parent.bIsActive = false;
        }
        else
        {
            this.parent.fire();
            this.parent.bIsActive = true;
        }
    }

	NodePin.prototype.update = function(drawPos, bIsOutput)
    {	
        this.drawPos = drawPos;
        this.isOutput = bIsOutput;
        
		if(draggingEl === undefined)
		{
			if(	mousePosition instanceof Vector && 
				mousePosition.x > this.drawPos.x && mousePosition.x < this.drawPos.x + 16 &&
				mousePosition.y > this.drawPos.y && mousePosition.y < this.drawPos.y + 16)
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
		this.myFillColor = ColorLerp(this.myFillColor, ColorLighten(styleData.pinFillColor[this.type] !== undefined ? styleData.pinFillColor[this.type] : "#FFFF00", this.bIsHovering ? 0.5 : 0), 0.2);
    };
	
	NodePin.prototype.draw = function()
	{             
        ctx.fillStyle = this.myFillColor;      
        
        ctx.beginPath();
        ctx.fillRect(this.drawPos.x, this.drawPos.y, 16, 16);
        ctx.fill();
        
        ctx.font = "8pt Trebuchet MS";
        ctx.fillStyle = "#000000";
        var stringWidth = ctx.measureText(this.label);
        
        if(this.isOutput)
            ctx.fillText(this.label, this.drawPos.x - stringWidth.width - 8, this.drawPos.y + 12); 
        else
            ctx.fillText(this.label, this.drawPos.x + 24, this.drawPos.y + 12); 
    };
    
    NodePin.prototype.drawConnectingLines = function()
    {
        var lineEndPoint = undefined;
        if(draggingEl === this)
        {
            lineEndPoint = mousePosition.Copy();            
        }
        else if(this.connectee !== undefined && this.isOutput)
        {
            lineEndPoint = this.connectee.drawPos.Copy().Add(new Vector(8, 8));
        }
        
        if(lineEndPoint !== undefined)
        {
            var controlPoint1 = new Vector(this.isOutput ? this.drawPos.x + Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x + 48), 256), 64) : this.drawPos.x - Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x), 256), 64), Lerp(this.drawPos.y + 8, lineEndPoint.y, 0.05));
            var controlPoint2 = new Vector(this.isOutput ? lineEndPoint.x - Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x + 48), 256), 64) : lineEndPoint.x + Math.max(Math.min(Math.abs(this.drawPos.x - lineEndPoint.x), 256), 64), Lerp(this.drawPos.y + 8, lineEndPoint.y, 0.95));
            ctx.beginPath();
            ctx.moveTo(this.drawPos.x + 8, this.drawPos.y + 8);
            ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y,
                              controlPoint2.x, controlPoint2.y,
                              lineEndPoint.x, lineEndPoint.y);
            ctx.stroke();
        }
    }
    		
    return NodePin;
})();
