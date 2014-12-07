/*****************************************************************************************************************************************
 * WireCoder
 *
 * Block Nodes (If, while, for, do-while etc)
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var IfNode = (function(_super)
{
    __extends(IfNode, _super);
    sidebar.AddToSidebar("IfNode", "If", "Flow");
    function IfNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    IfNode.prototype.onCreate = function()
    {
        this.displayName = "If";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Comparison", "bool"));
        this.outputs.push(new NodePin(this, "True", "flow"));
        this.outputs.push(new NodePin(this, "False", "flow"));
    }
    
    IfNode.prototype.execute = function()
    {
        if(this.getValue(this.inputs[1]) == true)
            this.outputs[0].fire(); 
        else
            this.outputs[1].fire(); 
    }
	    		
    return IfNode;
})(BasicNode);

var EndIfNode = (function(_super)
{
    __extends(EndIfNode, _super);
    sidebar.AddToSidebar("EndIfNode", "End If", "Flow");
    function EndIfNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    EndIfNode.prototype.onCreate = function()
    {
        this.displayName = "End If";
        this.inputs.push(new NodePin(this, "True", "flow"));
        this.inputs.push(new NodePin(this, "False", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    EndIfNode.prototype.execute = function()
    {
        this.outputs[0].fire();   
    }
	    		
    return EndIfNode;
})(BasicNode);


var WhileNode = (function(_super)
{
    WhileNode.stack = [];
    
    __extends(WhileNode, _super);
    sidebar.AddToSidebar("WhileNode", "While", "Flow");
    function WhileNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    WhileNode.prototype.onCreate = function()
    {
        this.displayName = "While";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Comparison", "bool"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    WhileNode.prototype.execute = function()
    {
        if(WhileNode.stack[WhileNode.stack.length - 1] !== this)
            WhileNode.stack.push(this);
        
        if(this.getValue(this.inputs[1]) != true)
        {
            WhileNode.stack.pop();
            _jumpingto = "EndWhileNode";
        }
            
        this.outputs[0].fire(); 
    }
	    		
    return WhileNode;
})(BasicNode);

var EndWhileNode = (function(_super)
{
    __extends(EndWhileNode, _super);
    sidebar.AddToSidebar("EndWhileNode", "End While", "Flow");
    function EndWhileNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    EndWhileNode.prototype.onCreate = function()
    {
        this.displayName = "End While";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    EndWhileNode.prototype.execute = function()
    {
        if(this.justJumpedTo === true || WhileNode.stack.length < 1)
            this.outputs[0].fire();
        else
            WhileNode.stack[WhileNode.stack.length - 1].fire();
        this.bIsActive = false;
    }
	    		
    return EndWhileNode;
})(BasicNode);
