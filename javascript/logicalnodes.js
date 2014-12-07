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
    sidebar.AddToSidebar("EqualToNode", "Equal To (==)", "Logic");
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
    
    EqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) == this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return EqualToNode;
})(BasicNode);

var StrictEqualToNode = (function(_super)
{
    __extends(StrictEqualToNode, _super);
    sidebar.AddToSidebar("StrictEqualToNode", "Strict Equal To (===)", "Logic");
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
    
    StrictEqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) === this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return StrictEqualToNode;
})(BasicNode);

var NotEqualToNode = (function(_super)
{
    __extends(NotEqualToNode, _super);
    sidebar.AddToSidebar("NotEqualToNode", "Not Equal To (!=)", "Logic");
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
    
    NotEqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) != this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return NotEqualToNode;
})(BasicNode);

var StrictNotEqualToNode = (function(_super)
{
    __extends(StrictNotEqualToNode, _super);
    sidebar.AddToSidebar("StrictNotEqualToNode", "Strict Not Equal To (!==)", "Logic");
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
    
    StrictNotEqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) !== this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return StrictNotEqualToNode;
})(BasicNode);

var GreaterThanNode = (function(_super)
{
    __extends(GreaterThanNode, _super);
    sidebar.AddToSidebar("GreaterThanNode", "Greater Than (>)", "Logic");
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
    
    GreaterThanNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) > this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return GreaterThanNode;
})(BasicNode);

var GreaterThanEqualToNode = (function(_super)
{
    __extends(GreaterThanEqualToNode, _super);
    sidebar.AddToSidebar("GreaterThanEqualToNode", "Greater Than/Equal (>=)", "Logic");
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
    
    GreaterThanEqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) >= this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return GreaterThanEqualToNode;
})(BasicNode);

var LessThanNode = (function(_super)
{
    __extends(LessThanNode, _super);
    sidebar.AddToSidebar("LessThanNode", "Less Than (<)", "Logic");
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
    
    LessThanNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) < this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return LessThanNode;
})(BasicNode);

var LessThanEqualToNode = (function(_super)
{
    __extends(LessThanEqualToNode, _super);
    sidebar.AddToSidebar("LessThanEqualToNode", "Less Than/Equal (<=)", "Logic");
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
    
    LessThanEqualToNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) <= this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return LessThanEqualToNode;
})(BasicNode);

var AndNode = (function(_super)
{
    __extends(AndNode, _super);
    sidebar.AddToSidebar("AndNode", "And (&&)", "Logic");
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
    
    AndNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) && this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return AndNode;
})(BasicNode);

var OrNode = (function(_super)
{
    __extends(OrNode, _super);
    sidebar.AddToSidebar("OrNode", "Or (||)", "Logic");
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
    
    OrNode.prototype.getValue = function(pin)
    {
        try
        {
            return (this.inputs[0].connectee.parent.getValue(undefined) || this.inputs[1].connectee.parent.getValue(undefined));
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return OrNode;
})(BasicNode);

var NotNode = (function(_super)
{
    __extends(NotNode, _super);
    sidebar.AddToSidebar("NotNode", "Not (!)", "Logic");
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
    
    NotNode.prototype.getValue = function(pin)
    {
        try
        {
            return !this.inputs[0].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return NotNode;
})(BasicNode);