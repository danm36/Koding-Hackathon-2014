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
    sidebar.AddToSidebar("ConfirmNode", "Confirm", "Input", "nodesInput", 0, 0);
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
    
    ConfirmNode.prototype.getCodeString = function()
    {
        var finalCode = "confirm(";
        var vars = [];
        
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = '"' + this.properties.message.value + '"';
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        finalCode += val + ")";
        
        val = this.outputs[1].getCodeString();
        if(val !== undefined)
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            finalCode = val[0].code + " = " + finalCode;
        }
        
        return [{ code: finalCode, vars: vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return ConfirmNode;
})(BasicNode);

var PromptNode = (function(_super)
{
    __extends(PromptNode, _super);
    sidebar.AddToSidebar("PromptNode", "Prompt", "Input", "nodesInput", 64, 0);
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
    
    PromptNode.prototype.getCodeString = function()
    {
        var finalCode = "prompt(";
        var vars = [];
        
        var val = this.inputs[1].getCodeString();
        if(val == undefined)
            val = '"' + this.properties.message.value + '"';
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        finalCode += val + ", "; 
        
        val = this.inputs[2].getCodeString();
        if(val === undefined)
            val = '"' + this.properties.defaultval.value + '"';
        else
        {   
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        finalCode += val + ")";
        
        val = this.outputs[1].getCodeString();
        if(val !== undefined)
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            finalCode = val[0].code + " = " + finalCode;
        }
        
        return [{ code: finalCode, vars: vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return PromptNode;
})(BasicNode);