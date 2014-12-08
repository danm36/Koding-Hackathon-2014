/*****************************************************************************************************************************************
 * WireCoder
 *
 * Logical nodes to handle various binary functions
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var EqualToNode = (function(_super)
{
    __extends(EqualToNode, _super);
    sidebar.AddToSidebar("EqualToNode", "Equal To (==)", "Logic", "nodesLogic", 0, 0);
    function EqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    EqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Equal To (A == B)";
        this.inputs.push(new NodePin(this, "A", "var"));
        this.inputs.push(new NodePin(this, "B", "var"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    EqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    EqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() == this.inputs[1].getValue());
    }
    
    EqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + " == ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return EqualToNode;
})(BasicNode);

var StrictEqualToNode = (function(_super)
{
    __extends(StrictEqualToNode, _super);
    sidebar.AddToSidebar("StrictEqualToNode", "Strict Equal To (===)", "Logic", "nodesLogic", 64, 0);
    function StrictEqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrictEqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Strict Equal To (A === B)";
        this.inputs.push(new NodePin(this, "A", "var"));
        this.inputs.push(new NodePin(this, "B", "var"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    StrictEqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    StrictEqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() === this.inputs[1].getValue());
    }
    
    StrictEqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + " === ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return StrictEqualToNode;
})(BasicNode);

var NotEqualToNode = (function(_super)
{
    __extends(NotEqualToNode, _super);
    sidebar.AddToSidebar("NotEqualToNode", "Not Equal To (!=)", "Logic", "nodesLogic", 128, 0);
    function NotEqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    NotEqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Not Equal To (A != B)";
        this.inputs.push(new NodePin(this, "A", "var"));
        this.inputs.push(new NodePin(this, "B", "var"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    NotEqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    NotEqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() != this.inputs[1].getValue());
    }
	    	
    NotEqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + " != ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
    
    return NotEqualToNode;
})(BasicNode);

var StrictNotEqualToNode = (function(_super)
{
    __extends(StrictNotEqualToNode, _super);
    sidebar.AddToSidebar("StrictNotEqualToNode", "Strict Not Equal To (!==)", "Logic", "nodesLogic", 196, 0);
    function StrictNotEqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrictNotEqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Strict Not Equal To (A !== B)";
        this.inputs.push(new NodePin(this, "A", "var"));
        this.inputs.push(new NodePin(this, "B", "var"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    StrictNotEqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    StrictNotEqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() !== this.inputs[1].getValue());
    }
    
    StrictNotEqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + " !== ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return StrictNotEqualToNode;
})(BasicNode);

var GreaterThanNode = (function(_super)
{
    __extends(GreaterThanNode, _super);
    sidebar.AddToSidebar("GreaterThanNode", "Greater Than (>)", "Logic", "nodesLogic", 0, 64);
    function GreaterThanNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    GreaterThanNode.prototype.onCreate = function()
    {
        this.displayName = "Greater Than (A > B)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    GreaterThanNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    GreaterThanNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() > this.inputs[1].getValue());
    }
    
    GreaterThanNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + " > ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return GreaterThanNode;
})(BasicNode);

var GreaterThanEqualToNode = (function(_super)
{
    __extends(GreaterThanEqualToNode, _super);
    sidebar.AddToSidebar("GreaterThanEqualToNode", "Greater Than/Equal (>=)", "Logic", "nodesLogic", 64, 64);
    function GreaterThanEqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    GreaterThanEqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Greater Than or Equal (A >= B)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    GreaterThanEqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    GreaterThanEqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() >= this.inputs[1].getValue());
    }
    
    GreaterThanEqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + " >= ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return GreaterThanEqualToNode;
})(BasicNode);

var LessThanNode = (function(_super)
{
    __extends(LessThanNode, _super);
    sidebar.AddToSidebar("LessThanNode", "Less Than (<)", "Logic", "nodesLogic", 128, 64);
    function LessThanNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    LessThanNode.prototype.onCreate = function()
    {
        this.displayName = "Less Than (A < B)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    LessThanNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    LessThanNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() < this.inputs[1].getValue());
    }
    
    LessThanNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
        }
        
        finalCode += val + " < ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return LessThanNode;
})(BasicNode);

var LessThanEqualToNode = (function(_super)
{
    __extends(LessThanEqualToNode, _super);
    sidebar.AddToSidebar("LessThanEqualToNode", "Less Than/Equal (<=)", "Logic", "nodesLogic", 196, 64);
    function LessThanEqualToNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    LessThanEqualToNode.prototype.onCreate = function()
    {
        this.displayName = "Less Than or Equal (A <= B)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    LessThanEqualToNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    LessThanEqualToNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() <= this.inputs[1].getValue());
    }
    
    LessThanEqualToNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + " <= ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return LessThanEqualToNode;
})(BasicNode);

var AndNode = (function(_super)
{
    __extends(AndNode, _super);
    sidebar.AddToSidebar("AndNode", "And (&&)", "Logic", "nodesLogic", 0, 128);
    function AndNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    AndNode.prototype.onCreate = function()
    {
        this.displayName = "And (A && B)";
        this.inputs.push(new NodePin(this, "A", "bool"));
        this.inputs.push(new NodePin(this, "B", "bool"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    AndNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    AndNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() && this.inputs[1].getValue());
    }
    
    AndNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + " && ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return AndNode;
})(BasicNode);

var OrNode = (function(_super)
{
    __extends(OrNode, _super);
    sidebar.AddToSidebar("OrNode", "Or (||)", "Logic", "nodesLogic", 64, 128);
    function OrNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    OrNode.prototype.onCreate = function()
    {
        this.displayName = "Or (A || B)";
        this.inputs.push(new NodePin(this, "A", "bool"));
        this.inputs.push(new NodePin(this, "B", "bool"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    OrNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    OrNode.prototype.getValue = function(pin)
    {
        return (this.inputs[0].getValue() || this.inputs[1].getValue());
    }
    
    OrNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + " || ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return OrNode;
})(BasicNode);

var NotNode = (function(_super)
{
    __extends(NotNode, _super);
    sidebar.AddToSidebar("NotNode", "Not (!)", "Logic", "nodesLogic", 128, 128);
    function NotNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    NotNode.prototype.onCreate = function()
    {
        this.displayName = "Or (!A)";
        this.inputs.push(new NodePin(this, "A", "bool"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
    }
    
    NotNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
    }
    
    NotNode.prototype.getValue = function(pin)
    {
        return !this.inputs[0].connectee.parent.getValue(undefined);
    }
    
    NotNode.prototype.getCodeString = function()
    {    
        var vars = []
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        return [{ code: "!" + val, vars: vars }];   
    }
	    		
    return NotNode;
})(BasicNode);