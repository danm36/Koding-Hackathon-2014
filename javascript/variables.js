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
    sidebar.AddToSidebar("VarNode", "var", "Variables");
    function VarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    VarNode.prototype.onCreate = function()
    {
        this.value = "";
        this.inputs.push(new NodePin(this, "In", "var"));
        this.outputs.push(new NodePin(this, "Out", "var"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "string", value: "" },
            variableName: { type: "string", value: "var" + this.getId() },
        };
    }
        
    VarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    VarNode.prototype.setValue = function(pin, value)
    {
        this.value = value;   
    }
    
    VarNode.prototype.reset = function()
    {
        this.value = this.properties.value.value;   
    }
    
    VarNode.prototype.update = function()
    {	      
        this.inputs[0].drawPos = this.outputs[0].drawPos = this.drawPos;
        
        this.displayName = this.properties.variableName.value;
        
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
        
        if(selectedEl == this && !mouseDown)
        {
            ctx.shadowColor = styleData.nodeSelectionGlow;
            ctx.shadowBlur = 20;
        }
        ctx.beginPath();
        ctx.moveTo(this.drawPos.x + this.size.x, this.drawPos.y + this.size.y / 2);
        ctx.arc(this.drawPos.x + this.size.x / 2, this.drawPos.y + this.size.y / 2, this.size.x / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        
        ctx.font = "8pt Trebuchet MS";
        ctx.fillStyle = "#FFFFFF";
        var dispValue = "";
        
        if(this.value instanceof Array)
            dispValue = "Array[" + this.value.length + "]";
        else if(this.value instanceof Object)
            dispValue = "Object";
        else if(this.properties.value.type != "number" && (typeof this.value == "string" || this.value instanceof String))
            dispValue = "\"" + this.value + "\"";
        else
            dispValue = String(this.value);
        
        dispValue = dispValue.substr(0, Lerp(12, dispValue.length, this.hoverTimer));
        ctx.fillText(dispValue, this.drawPos.x + this.size.x / 2 - ctx.measureText(dispValue).width / 2 - 1, this.drawPos.y + this.size.y / 2 + 3);
        ctx.fillStyle = "#000000";
        ctx.fillText(dispValue, this.drawPos.x + this.size.x / 2 - ctx.measureText(dispValue).width / 2, this.drawPos.y + this.size.y / 2 + 4);    
        ctx.font = "10pt Trebuchet MS";
        ctx.fillText(this.displayName, this.drawPos.x + this.size.x / 2 - ctx.measureText(this.displayName).width / 2, this.drawPos.y + this.size.y + 12); 
    };
    
    return VarNode;
})(BasicNode);

var BoolVarNode = (function(_super)
{
    __extends(BoolVarNode, _super);
    sidebar.AddToSidebar("BoolVarNode", "Boolean", "Variables");
    function BoolVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    BoolVarNode.prototype.onCreate = function()
    {
        this.value = false;
        this.inputs.push(new NodePin(this, "In", "bool"));
        this.outputs.push(new NodePin(this, "Out", "bool"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "bool", value: false },
            variableName: { type: "string", value: "bool" + this.getId() },
        };
    }
    
    BoolVarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    BoolVarNode.prototype.setValue = function(pin, value)
    {
        this.value = !!value; 
    }
    
    return BoolVarNode;
})(VarNode);

var StringVarNode = (function(_super)
{
    __extends(StringVarNode, _super);
    sidebar.AddToSidebar("StringVarNode", "String", "Variables");
    function StringVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StringVarNode.prototype.onCreate = function()
    {
        this.value = false;
        this.inputs.push(new NodePin(this, "In", "string"));
        this.outputs.push(new NodePin(this, "Out", "string"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "string", value: "" },
            variableName: { type: "string", value: "str" + this.getId() },
        };
    }
    
    StringVarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    StringVarNode.prototype.setValue = function(pin, value)
    {
        this.value = String(value);  
    }
    
    return StringVarNode;
})(VarNode);

var NumberVarNode = (function(_super)
{
    __extends(NumberVarNode, _super);
    sidebar.AddToSidebar("NumberVarNode", "Number", "Variables");
    function NumberVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    NumberVarNode.prototype.onCreate = function()
    {
        this.value = false;
        this.inputs.push(new NodePin(this, "In", "number"));
        this.outputs.push(new NodePin(this, "Out", "number"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "number", value: 0 },
            variableName: { type: "string", value: "str" + this.getId() },
        };
    }
    
    NumberVarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    NumberVarNode.prototype.setValue = function(pin, value)
    {
        this.value = parseFloat(value);
    }
    
    return NumberVarNode;
})(VarNode);

var ObjectVarNode = (function(_super)
{
    __extends(ObjectVarNode, _super);
    sidebar.AddToSidebar("ObjectVarNode", "Object", "Variables");
    function ObjectVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ObjectVarNode.prototype.onCreate = function()
    {
        this.value = false;
        this.inputs.push(new NodePin(this, "In", "object"));
        this.outputs.push(new NodePin(this, "Out", "object"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "object", value: {} },
            variableName: { type: "string", value: "str" + this.getId() },
        };
    }
    
    ObjectVarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    ObjectVarNode.prototype.setValue = function(pin, value)
    {
        this.value = value;
    }
    
    return ObjectVarNode;
})(VarNode);

var ArrayVarNode = (function(_super)
{
    __extends(ArrayVarNode, _super);
    sidebar.AddToSidebar("ArrayVarNode", "Array", "Variables");
    function ArrayVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ArrayVarNode.prototype.onCreate = function()
    {
        this.value = false;
        this.inputs.push(new NodePin(this, "In", "array"));
        this.outputs.push(new NodePin(this, "Out", "array"));
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "array", value: [] },
            variableName: { type: "string", value: "str" + this.getId() },
        };
    }
    
    ArrayVarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    ArrayVarNode.prototype.setValue = function(pin, value)
    {
        this.value = value;
    }
    
    return ArrayVarNode;
})(VarNode);