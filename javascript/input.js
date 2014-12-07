/*****************************************************************************************************************************************
 * WireCoder
 *
 * Input Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var ConfirmNode = (function(_super)
{
    __extends(ConfirmNode, _super);
    sidebar.AddToSidebar("ConfirmNode", "Confirm", "Input");
    function ConfirmNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ConfirmNode.prototype.onCreate = function()
    {
        this.displayName = "confirm()";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Message", "string"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        this.outputs.push(new NodePin(this, "Result", "bool"));
        
        this.properties = {
            message: { type: "string", value: "Are you sure?" },
        };
    }
    
    ConfirmNode.prototype.execute = function()
    {
        this.setValue(this.outputs[1], confirm(this.getValue(this.inputs[1]) || this.properties.message.value));
        this.outputs[0].fire();   
    }
	    		
    return ConfirmNode;
})(BasicNode);

var PromptNode = (function(_super)
{
    __extends(PromptNode, _super);
    sidebar.AddToSidebar("PromptNode", "Prompt", "Input");
    function PromptNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    PromptNode.prototype.onCreate = function()
    {
        this.displayName = "prompt()";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Message", "string"));
        this.inputs.push(new NodePin(this, "Default Val", "string"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        this.outputs.push(new NodePin(this, "Result", "string"));
        
        this.properties = {
            message: { type: "string", value: "Enter a value" },
            defaultval: { type: "string", value: "" },
        };
    }
    
    PromptNode.prototype.execute = function()
    {
        this.setValue(this.outputs[1], prompt(this.getValue(this.inputs[1]) || this.properties.message.value, this.getValue(this.inputs[2]) || this.properties.defaultval.value));
        this.outputs[0].fire();   
    }
	    		
    return PromptNode;
})(BasicNode);