/*****************************************************************************************************************************************
 * WireCoder
 *
 * Input Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var PromptNode = (function(_super)
{
    __extends(PromptNode, _super);
    function PromptNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    PromptNode.prototype.onCreate = function()
    {
        this.displayName = "prompt()";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Message", "var"));
        this.inputs.push(new NodePin(this, "Default Val", "var"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        this.outputs.push(new NodePin(this, "Result", "var"));
    }
    
    PromptNode.prototype.execute = function()
    {
        this.setValue(this.outputs[1], prompt(this.getValue(this.inputs[1]), this.getValue(this.inputs[2])));
        this.outputs[0].fire();   
    }
	    		
    return PromptNode;
})(BasicNode);