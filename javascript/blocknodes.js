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
    
    IfNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[1].connectee === undefined)
        {
            this.curError = "Missing boolean comparison parameter";   
            return;
        }
    }
    
    IfNode.prototype.execute = function()
    {
        if(this.getValue(this.inputs[1]) == true)
            this.outputs[0].fire(); 
        else
            this.outputs[1].fire(); 
    }
    
    IfNode.prototype.getCodeString = function()
    {
        var finalCode = "if(";
        
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "false /* Error: Missing node connection */";
        else
            val = val[0].code;        
        finalCode += val + ")";
        
        var trueBranch = this.outputs[0].getCodeString();
        var falseBranch = this.outputs[1].getCodeString();
        var result = [{ code: finalCode, indent: true }];
        var postIf = undefined;
        
        if(trueBranch !== undefined)
        {
            for(var i = 0; i < trueBranch.length; i++)
            {
                if(trueBranch[i] === undefined)
                {
                    postIf = trueBranch.slice(i + 1, trueBranch.length - i);
                    break;
                }
                
                result.push(trueBranch[i]);
            }
            result.push({exdent: true});
            
            if(falseBranch !== undefined)
            {
                result.push({code: "else", indent: true});
                for(var i = 0; i < falseBranch.length; i++)
                {
                    if(falseBranch[i] == undefined)
                        break;
                    
                    result.push(falseBranch[i]);
                }
                result.push({exdent: true});
            }
            
            result = result.concat(postIf);
        }
        
        console.log(result);
        console.log(trueBranch);
        console.log(falseBranch);
        
        return result;   
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
    
    EndIfNode.prototype.getCodeString = function()
    {
        return [undefined].concat(this.outputs[0].getCodeString());   
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
    
    WhileNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[1].connectee === undefined)
        {
            this.curError = "Missing boolean comparison parameter";   
            return;
        }
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
    
    WhileNode.prototype.getCodeString = function()
    {
        var finalCode = "while(";
        
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "false /* Error: Missing node connection */";
        else
            val = val[0].code;        
        finalCode += val + ");";
        
        return [{ code: finalCode, indent: true }].concat(this.outputs[0].getCodeString());   
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
    
    EndWhileNode.prototype.getCodeString = function()
    {    
        return [{ exdent: true }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return EndWhileNode;
})(BasicNode);
