/*****************************************************************************************************************************************
 * WireCoder
 *
 * Function Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var FunctionNode = (function(_super)
{
    FunctionNode.funcTable = [];
    
    __extends(FunctionNode, _super);
    sidebar.AddToSidebar("FunctionNode", "Function", "Basic", "nodesCore", 64, 0);
    function FunctionNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    FunctionNode.prototype.onCreate = function()
    {
        this.displayName = "func" + this.getId() + "()";
        this.outputs.push(new NodePin(this, "Out", "flow"));
        
        this.properties = {
            name: { type: "string", value: "func" + this.getId() },
            parameterCount: { type: "number", value: 0, min: 0, max: 32, step: 1 },
        };
        
        FunctionNode.funcTable.push(this);
    }
    
    FunctionNode.prototype.onDelete = function()
    {
        var index = FunctionNode.funcTable.indexOf(this);
        if(index >= 0)
            FunctionNode.funcTable.splice(index, 1);
    }
    
    FunctionNode.prototype.reset = function()
    {
        this.displayName = this.properties.name.value + "()";
       
        if(this.properties.parameterCount.value != this.lastParamCount)
        {
            var outFlow = this.outputs[0];
            this.outputs = [outFlow];
            
            for(var i = 0; i < this.properties.parameterCount.value; i++)
                this.outputs.push(new NodePin(this, "Param " + (i + 1), "var"));
            this.lastParamCount = this.properties.parameterCount.value;
        }
    }
    
    FunctionNode.prototype.execute = function(params)
    {
        for(var i = 1; i < this.outputs.length; i++)
            this.setValue(this.outputs[i], params[i - 1]);
        
        this.outputs[0].fire();
    }
    
    FunctionNode.prototype.getCodeString = function()
    {
        return [{ code: "function " + this.properties.name.value + "(params)", indent: true, dontsemi: true }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return FunctionNode;
})(BasicNode);

var MainFunctionNode = (function(_super)
{
    __extends(MainFunctionNode, _super);
    function MainFunctionNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    MainFunctionNode.prototype.onCreate = function()
    {
        this.displayName = "Main Function";
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    MainFunctionNode.prototype.fire = function()
    {
        var self = this;
        setTimeout(function()
        {
            self.execute();
        }, _playbackSpeed);
    }
 
    MainFunctionNode.prototype.getCodeString = function()
    {
        return [{ code: "function Main()", indent: true, dontsemi: true  }].concat(this.outputs[0].getCodeString());   
    }
    
    return MainFunctionNode;
})(BasicNode);


var CallFunctionNode = (function(_super)
{
    CallFunctionNode.waitStack = [];
    
    __extends(CallFunctionNode, _super);
    sidebar.AddToSidebar("CallFunctionNode", "Call Function", "Basic", "nodesCore", 128, 0);
    function CallFunctionNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    CallFunctionNode.prototype.onCreate = function()
    {
        this.displayName = "Call function";
        
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        
        this.properties = {
            toCall: { type: "string", value: "" },
        };
    }
    
    CallFunctionNode.prototype.reset = function()
    {
        this.displayName = "Call " + this.properties.toCall.value + "()";
        if(this.properties.toCall.value.trim() === "")
        {
            this.inputs = [this.inputs[0]];   
            this.curError = "Missing function name to call";   
            return;
        }
        
        if(this.properties.toCall.value != this.lastParamToCall)
        {
            this.curError = undefined;
            this.myFunc = undefined;
        
            for(var i = 0; i < FunctionNode.funcTable.length; i++)
            {
                if(FunctionNode.funcTable[i].properties.name.value == this.properties.toCall.value)
                {
                    this.myFunc = FunctionNode.funcTable[i];
                    break;
                }
            }
           
            if(this.myFunc !== undefined)
            {
                if(this.myFunc.properties.parameterCount.value != this.lastParamCount)
                {
                    var inFlow = this.inputs[0];
                    this.inputs = [inFlow];
            
                    for(var i = 0; i < this.myFunc.properties.parameterCount.value; i++)
                        this.inputs.push(new NodePin(this, "Param " + (i + 1), "var"));
                    this.lastParamCount = this.myFunc.properties.parameterCount.value;
                }     
            }
            else
            {
                this.inputs = [this.inputs[0]];   
                this.curError = "No function called '" + this.properties.toCall.value + "'";   
            }
        }
    }
    
    CallFunctionNode.prototype.execute = function(fromStack)
    {
        if(fromStack === true)
        {
            this.outputs[0].fire();
            return;
        }
        
        var params = [];
        for(var i = 1; i < this.inputs.length; i++)
            params.push(this.getValue(this.inputs[i]));
        
        this.myFunc.fire(params);
        CallFunctionNode.waitStack.push(this);
    }
    
    CallFunctionNode.prototype.getCodeString = function()
    {
        var params = "";
        if(this.inputs.length > 1)
        {
            var params = "[";
            for(var i = 1; i < this.inputs.length; i++)
            {
                var cs = this.inputs[i].getCodeString();
                if(cs !== undefined && cs.code !== undefined)
                    params += (i != 1 ? ", " : "") + cs.code;
            }
            params += "]";
        }
        return [{ code: this.properties.toCall.value + "(" + params + ");", dontsemi: true  }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return CallFunctionNode;
})(BasicNode);