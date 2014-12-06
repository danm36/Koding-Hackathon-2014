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
    }
    
    BasicNode.prototype.onCreate = function()
    {
        this.displayName = "Relay";
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
		
	BasicNode.prototype.update = function()
    {	
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
            this.drawPos = mousePosition.Copy().Subtract(this.size.Divide(2));
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
		this.myFillColor = ColorLerp(this.myFillColor, ColorDarken(styleData.nodeFill, this.bIsHovering ? 0.8 : 1), 0.2);
        
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
    };
    		
    return BasicNode;
})();
