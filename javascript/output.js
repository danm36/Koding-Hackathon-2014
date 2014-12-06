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
        this.inputs.push(new NodePin(this, "To Print", "string"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        
        this.properties = {
            output: { type: "string", value: "" },
        };
    }
    
    ConsoleLogNode.prototype.execute = function()
    {
        console.log(this.getValue(this.inputs[1]) || this.properties.output.value);
        this.outputs[0].fire();   
    }
	    		
    return ConsoleLogNode;
})(BasicNode);