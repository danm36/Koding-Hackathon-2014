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