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
    sidebar.AddToSidebar("VarNode", "Var (Any type)", "Variables");
    function VarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    VarNode.prototype.onCreate = function()
    {
        this.value = "";
        var IOPin = new NodePin(this, "IO", "var", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "string", value: "", tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "var" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
        };
    }
        
    VarNode.prototype.getValue = function(pin)
    {
        return this.value;
    }
    
    VarNode.prototype.setValue = function(pin, value)
    {
        if(this.properties.isConst !== true)
            this.value = value;
        else
            this.curError = "Cannot set a constant value";
    }
    
    VarNode.prototype.reset = function()
    {
        this.curError = undefined;
        this.value = this.properties.value.value;   
    }
    
    VarNode.prototype.getCodeString = function()
    {
        if(this.properties.isConst.value === true)
        {
            if(this.value instanceof Array)
                return [{code: "Array[" + this.value.length + "]", vars: []}];
            else if(this.value instanceof Object)
                return [{code: "Object", vars: []}];
            else if(this.properties.value.type != "number" && (typeof this.properties.value.value == "string" || this.properties.value.value instanceof String))
                return [{code: "\"" + this.properties.value.value + "\"", vars: []}];
            else
                return [{code: String(this.properties.value.value), vars: []}];
        }
        
        var defVal = this.properties.value.value;
        if(this.properties.value.type != "number" && (typeof this.properties.value.value == "string" || this.properties.value.value instanceof String))
            defVal = "\"" + this.properties.value.value + "\"";
        
        return [{
            code: (this.properties.variableName.value.trim() != "" ? this.properties.variableName.value.trim() : this.type + this.getId()),
            vars: [{ name: (this.properties.variableName.value.trim() != "" ? this.properties.variableName.value.trim() : this.type + this.getId()), default: defVal }],       
        }];   
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
        //Bounds checking so we can avoid expensive bezier or circle drawing
		//bDontClip stops minimap clipping
        if( bDontClip !== true && (
			(this.drawPos.x + this.size.x) * actualZoomLevel 	< -actualPanPosition.x ||
			(this.drawPos.x * actualZoomLevel) - canvas.width 	> -actualPanPosition.x ||
			(this.drawPos.y + this.size.y) * actualZoomLevel 	< -actualPanPosition.y ||
			(this.drawPos.y * actualZoomLevel) - canvas.height 	> -actualPanPosition.y))
		  return;
        
        ctx.fillStyle = this.myFillColor;
        ctx.strokeStyle = styleData.pinFillColor[this.outputs[0].type] || "#000000";
        
        if(selectedEl == this && !mouseDown)
        {
            ctx.shadowColor = styleData.nodeSelectionGlow;
            ctx.shadowBlur = 20;
        }
        ctx.beginPath();
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
    }
    
	VarNode.prototype.drawConnectingLines = function() { };
    
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
        var IOPin = new NodePin(this, "IO", "bool", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "bool", value: false, tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "bool" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
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
        var IOPin = new NodePin(this, "IO", "string", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "string", value: "", tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "str" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
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
        var IOPin = new NodePin(this, "IO", "number", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "number", value: 0, tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "num" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
        };
    }
    
    NumberVarNode.prototype.getValue = function(pin)
    {
        return parseFloat(this.value);
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
        var IOPin = new NodePin(this, "IO", "object", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "object", value: {}, tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "obj" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
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
        var IOPin = new NodePin(this, "IO", "array", true);
        this.inputs.push(IOPin);
        this.outputs.push(IOPin);
        this.inputs[0].radius = this.outputs[0].radius = this.size.x = this.size.y = 64;
        this.outputs[0].isOutput = true;
        this.properties = {
            value: { type: "array", value: [], tip: "The initial value of the variable when the code first runs" },
            variableName: { type: "string", value: "arr" + this.getId(), tip: "The name of the variable" },
            isConst: { type: "bool", value: false, tip: "If true, this variable is replaced with its value in code output. Cannot be set by code." },
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