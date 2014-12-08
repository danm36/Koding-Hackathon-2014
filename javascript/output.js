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
    sidebar.AddToSidebar("ConsoleLogNode", "console.log()", "Output");
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
    
    ConsoleLogNode.prototype.getCodeString = function()
    {
        var finalCode = "console.log(";
        var vars = [];
        
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = '"' + this.properties.output.value + '"';
        else
        {
            vars = val[0].vars;
            val = val[0].code;         
        }
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return ConsoleLogNode;
})(BasicNode);

var AlertNode = (function(_super)
{
    __extends(AlertNode, _super);
    sidebar.AddToSidebar("AlertNode", "Alert", "Output");
    function AlertNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    AlertNode.prototype.onCreate = function()
    {
        this.displayName = "confirm()";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Message", "string"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        
        this.properties = {
            message: { type: "string", value: "Something happened" },
        };
    }
    
    AlertNode.prototype.execute = function()
    {
        alert(this.getValue(this.inputs[1]) || this.properties.message.value);
        this.outputs[0].fire();   
    }
    
    AlertNode.prototype.getCodeString = function()
    {
        var finalCode = "alert(";
        var vars = [];
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = '"' + this.properties.message.value + '"';
        else
        {
            vars = val[0].vars;
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return AlertNode;
})(BasicNode);