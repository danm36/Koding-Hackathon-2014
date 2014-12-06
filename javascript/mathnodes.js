/*****************************************************************************************************************************************
 * WireCoder
 *
 * Math nodes to handle various mathermatical functions
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var AddNode = (function(_super)
{
    __extends(AddNode, _super);
    function AddNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    AddNode.prototype.onCreate = function()
    {
        this.displayName = "Add";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    AddNode.prototype.getValue = function(pin)
    {
        try
        {
            return this.inputs[0].connectee.parent.getValue(undefined) + this.inputs[1].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
	    		
    return AddNode;
})(BasicNode);

var SubtractNode = (function(_super)
{
    __extends(SubtractNode, _super);
    function SubtractNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SubtractNode.prototype.onCreate = function()
    {
        this.displayName = "Subtract";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
	    	
    SubtractNode.prototype.getValue = function(pin)
    {
        try
        {
            return this.inputs[0].connectee.parent.getValue(undefined) - this.inputs[1].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
    
    return SubtractNode;
})(BasicNode);

var MultiplyNode = (function(_super)
{
    __extends(MultiplyNode, _super);
    function MultiplyNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    MultiplyNode.prototype.onCreate = function()
    {
        this.displayName = "Multiply";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    MultiplyNode.prototype.getValue = function(pin)
    {
        try
        {
            return this.inputs[0].connectee.parent.getValue(undefined) * this.inputs[1].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
    	    		
    return MultiplyNode;
})(BasicNode);

var DivideNode = (function(_super)
{
    __extends(DivideNode, _super);
    function DivideNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DivideNode.prototype.onCreate = function()
    {
        this.displayName = "Multiply";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    	
    DivideNode.prototype.getValue = function(pin)
    {
        try
        {
            return this.inputs[0].connectee.parent.getValue(undefined) / this.inputs[1].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
    
    return DivideNode;
})(BasicNode);

var ModulusNode = (function(_super)
{
    __extends(ModulusNode, _super);
    function ModulusNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ModulusNode.prototype.onCreate = function()
    {
        this.displayName = "Modulus";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    	 
    ModulusNode.prototype.getValue = function(pin)
    {
        try
        {
            return this.inputs[0].connectee.parent.getValue(undefined) % this.inputs[1].connectee.parent.getValue(undefined);
        }
        catch(err)
        {
            console.error(err);
            _WCState = 2;
        }
    }
    
    return ModulusNode;
})(BasicNode);