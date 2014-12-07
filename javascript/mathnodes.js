/*****************************************************************************************************************************************
 * WireCoder
 *
 * Math nodes to handle various mathermatical functions
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var SetVarNode = (function(_super)
{
    __extends(SetVarNode, _super);
    sidebar.AddToSidebar("SetVarNode", "Set Var", "Basic");
    function SetVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SetVarNode.prototype.onCreate = function()
    {
        this.displayName = "Set Var (Result = Var)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "var"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        this.outputs.push(new NodePin(this, "Result", "var"));
    }
    
    SetVarNode.prototype.execute = function()
    {
        this.setValue(this.outputs[1], this.getValue(this.inputs[1]));
        this.outputs[0].fire();
    }
	    		
    return SetVarNode;
})(BasicNode);

var AddNode = (function(_super)
{
    __extends(AddNode, _super);
    sidebar.AddToSidebar("AddNode", "Add (+)", "Math");
    function AddNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    AddNode.prototype.onCreate = function()
    {
        this.displayName = "Add (A + B = Result)";
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
    sidebar.AddToSidebar("SubtractNode", "Subtract (-)", "Math");
    function SubtractNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SubtractNode.prototype.onCreate = function()
    {
        this.displayName = "Subtract (A - B = Result)";
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
    sidebar.AddToSidebar("MultiplyNode", "Multiply (*)", "Math");
    function MultiplyNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    MultiplyNode.prototype.onCreate = function()
    {
        this.displayName = "Multiply (A * B = Result)";
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
    sidebar.AddToSidebar("DivideNode", "Divide (/)", "Math");
    function DivideNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DivideNode.prototype.onCreate = function()
    {
        this.displayName = "Divide (A / B = Result)";
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

var ModuloNode = (function(_super)
{
    __extends(ModuloNode, _super);
    sidebar.AddToSidebar("ModuloNode", "Modulo (%)", "Math");
    function ModuloNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ModuloNode.prototype.onCreate = function()
    {
        this.displayName = "Modulo (A % B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    	 
    ModuloNode.prototype.getValue = function(pin)
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
    
    return ModuloNode;
})(BasicNode);

var IncrementNode = (function(_super)
{
    __extends(IncrementNode, _super);
    sidebar.AddToSidebar("IncrementNode", "Increment (++)", "Math");
    function IncrementNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    IncrementNode.prototype.onCreate = function()
    {
        this.displayName = "Increment (Var++)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    IncrementNode.prototype.execute = function()
    {
        this.setValue(this.inputs[1], this.getValue(this.inputs[1]) + 1);
        this.outputs[0].fire();
    }
	    		
    return IncrementNode;
})(BasicNode);

var DecrementNode = (function(_super)
{
    __extends(DecrementNode, _super);
    sidebar.AddToSidebar("DecrementNode", "Decrement (--)", "Math");
    function DecrementNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DecrementNode.prototype.onCreate = function()
    {
        this.displayName = "Decrement (Var--)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    DecrementNode.prototype.execute = function()
    {
        this.setValue(this.inputs[1], this.getValue(this.inputs[1]) - 1);
        this.outputs[0].fire();
    }
	    		
    return DecrementNode;
})(BasicNode);

var IncrementInlineNode = (function(_super)
{
    __extends(IncrementInlineNode, _super);
    sidebar.AddToSidebar("IncrementInlineNode", "Increment Inline (++)", "Math");
    function IncrementInlineNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    IncrementInlineNode.prototype.onCreate = function()
    {
        this.displayName = "Increment Inline (Var++)";
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    IncrementInlineNode.prototype.getValue = function(pin)
    {
        this.inputs[0].connectee.parent.setValue(undefined, this.inputs[0].connectee.parent.getValue() + 1);
        return this.inputs[0].connectee.parent.getValue();
    }
	    		
    return IncrementInlineNode;
})(BasicNode);

var DecrementInlineNode = (function(_super)
{
    __extends(DecrementInlineNode, _super);
    sidebar.AddToSidebar("DecrementInlineNode", "Decrement Inline (--)", "Math");
    function DecrementInlineNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DecrementInlineNode.prototype.onCreate = function()
    {
        this.displayName = "Decrement Inline (Var++)";
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    DecrementInlineNode.prototype.getValue = function(pin)
    {
        this.inputs[0].connectee.parent.setValue(undefined, this.inputs[0].connectee.parent.getValue() - 1);
        return this.inputs[0].connectee.parent.getValue();
    }
	    		
    return DecrementInlineNode;
})(BasicNode);