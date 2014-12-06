/*****************************************************************************************************************************************
 * WireCoder
 *
 * Output Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var ConsoleLogNode = (function(_super)
{
    __extends(ConsoleLogNode, _super);
    function ConsoleLogNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ConsoleLogNode.prototype.onCreate = function()
    {
        this.displayName = "console.log()";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    ConsoleLogNode.prototype.execute = function()
    {
        console.log("Fired");
        this.outputs[0].fire();   
    }
	    		
    return ConsoleLogNode;
})(BasicNode);