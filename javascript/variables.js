/*****************************************************************************************************************************************
 * WireCoder
 *
 * Variable Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var VarNode = (function(_super)
{
    __extends(VarNode, _super);
    function VarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    VarNode.prototype.onCreate = function()
    {
        this.displayName = "Var";
        this.inputs.push(new NodePin(this, "In", "var"));
        this.outputs.push(new NodePin(this, "Out", "var"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.value = "A very long string detailing very long stuff oh yes";
    }
        
    VarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    VarNode.prototype.setValue = function(pin, value)
    {
        this.value = value;   
    }
    
    VarNode.prototype.update = function()
    {	      
        this.inputs[0].drawPos = this.outputs[0].drawPos = this.drawPos;
        
		if(draggingEl === undefined)
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
        else if(draggingEl === this)
        {
            if(ctrlDownOnDrag == true)
                this.drawPos = mousePosition.Copy().Subtract(this.size.Divide(2));
            else
                draggingEl = this.outputs[0];
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
    };
	
    VarNode.prototype.draw = function(bDontClip)
    {
        this.bDontDraw = bDontClip;
    }
    
	VarNode.prototype.drawConnectingLines = function()
	{        
		//Bounds checking so we can avoid expensive bezier or circle drawing
		//bDontClip stops minimap clipping
        if( this.bDontDraw !== true && (
			(this.drawPos.x + this.size.x) * actualZoomLevel 	< -actualPanPosition.x ||
			(this.drawPos.x * actualZoomLevel) - canvas.width 	> -actualPanPosition.x ||
			(this.drawPos.y + this.size.y) * actualZoomLevel 	< -actualPanPosition.y ||
			(this.drawPos.y * actualZoomLevel) - canvas.height 	> -actualPanPosition.y))
		  return;
        
        this.inputs[0].drawConnectingLines();
        this.outputs[0].drawConnectingLines();
        
        ctx.fillStyle = this.myFillColor;
        ctx.strokeStyle = styleData.pinFillColor[this.outputs[0].type] || "#000000";
        
        ctx.beginPath();
        ctx.moveTo(this.drawPos.x + this.size.x, this.drawPos.y + this.size.y / 2);
        ctx.arc(this.drawPos.x + this.size.x / 2, this.drawPos.y + this.size.y / 2, this.size.x / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        
        ctx.font = "8pt Trebuchet MS";
        ctx.fillStyle = "#FFFFFF";
        var dispValue = this.value.substr(0, Lerp(12, this.value.length, this.hoverTimer));
        ctx.fillText(dispValue, this.drawPos.x + this.size.x / 2 - ctx.measureText(dispValue).width / 2 - 1, this.drawPos.y + this.size.y / 2 + 3);
        ctx.fillStyle = "#000000";
        ctx.fillText(dispValue, this.drawPos.x + this.size.x / 2 - ctx.measureText(dispValue).width / 2, this.drawPos.y + this.size.y / 2 + 4);    
        ctx.font = "10pt Trebuchet MS";
        ctx.fillText(this.displayName, this.drawPos.x + this.size.x / 2 - ctx.measureText(this.displayName).width / 2, this.drawPos.y + this.size.y + 12); 
    };
    
    return VarNode;
})(BasicNode);
