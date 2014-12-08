/*****************************************************************************************************************************************
 * WireCoder
 *
 * Math nodes to handle various mathermatical functions
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var SetVarNode = (function(_super)
{
    __extends(SetVarNode, _super);
    sidebar.AddToSidebar("SetVarNode", "Set Var", "Basic", "nodesCore", 196, 0);
    function SetVarNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SetVarNode.prototype.onCreate = function()
    {
        this.displayName = "Set Var (Result = Var)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "var"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
        this.outputs.push(new NodePin(this, "Result", "var"));
    }
    
    SetVarNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'Var' parameter";
        else if(this.outputs[1].connectee == undefined)
            this.curError = "Missing 'Result' parameter";
    }
    
    SetVarNode.prototype.execute = function()
    {
        this.setValue(this.outputs[1], this.getValue(this.inputs[1]));
        this.outputs[0].fire();
    }
    
    SetVarNode.prototype.getCodeString = function()
    {    
        var finalCode = "";
        var vars = [];
        
        var val = this.outputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing result node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + " = ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing var node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
        }
        
        finalCode += val;
        
        return [{ code: finalCode, vars: vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return SetVarNode;
})(BasicNode);

var AddNode = (function(_super)
{
    __extends(AddNode, _super);
    sidebar.AddToSidebar("AddNode", "Add (+)", "Math", "nodesMath", 0, 0);
    function AddNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    AddNode.prototype.onCreate = function()
    {
        this.displayName = "Add (A + B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    AddNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    AddNode.prototype.getValue = function(pin)
    {
        return this.inputs[0].connectee.parent.getValue(undefined) + this.inputs[1].connectee.parent.getValue(undefined);
    }
    
    AddNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = []
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]);
            val = val[0].code;          
        }
        
        finalCode += val + " + ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {     
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]);  
            val = val[0].code;
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];    
    }
	    		
    return AddNode;
})(BasicNode);

var SubtractNode = (function(_super)
{
    __extends(SubtractNode, _super);
    sidebar.AddToSidebar("SubtractNode", "Subtract (-)", "Math", "nodesMath", 64, 0);
    function SubtractNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SubtractNode.prototype.onCreate = function()
    {
        this.displayName = "Subtract (A - B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    SubtractNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
	    	
    SubtractNode.prototype.getValue = function(pin)
    {
        return this.inputs[0].connectee.parent.getValue(undefined) - this.inputs[1].connectee.parent.getValue(undefined);
    }
    
    SubtractNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = []
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {  
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]);
            val = val[0].code;
        }
        
        finalCode += val + " - ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];    
    }
    
    return SubtractNode;
})(BasicNode);

var MultiplyNode = (function(_super)
{
    __extends(MultiplyNode, _super);
    sidebar.AddToSidebar("MultiplyNode", "Multiply (*)", "Math", "nodesMath", 128, 0);
    function MultiplyNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    MultiplyNode.prototype.onCreate = function()
    {
        this.displayName = "Multiply (A * B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    MultiplyNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    MultiplyNode.prototype.getValue = function(pin)
    {
        return this.inputs[0].connectee.parent.getValue(undefined) * this.inputs[1].connectee.parent.getValue(undefined);
    }
    
    MultiplyNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = []
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {   
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + " * ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];    
    }
    	    		
    return MultiplyNode;
})(BasicNode);

var DivideNode = (function(_super)
{
    __extends(DivideNode, _super);
    sidebar.AddToSidebar("DivideNode", "Divide (/)", "Math", "nodesMath", 196, 0);
    function DivideNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DivideNode.prototype.onCreate = function()
    {
        this.displayName = "Divide (A / B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    DivideNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    	
    DivideNode.prototype.getValue = function(pin)
    {
        return this.inputs[0].connectee.parent.getValue(undefined) / this.inputs[1].connectee.parent.getValue(undefined);
    }
    
    DivideNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = []
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + " / ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        {  
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];    
    }
    
    return DivideNode;
})(BasicNode);

var ModuloNode = (function(_super)
{
    __extends(ModuloNode, _super);
    sidebar.AddToSidebar("ModuloNode", "Modulo (%)", "Math", "nodesMath", 0, 64);
    function ModuloNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    ModuloNode.prototype.onCreate = function()
    {
        this.displayName = "Modulo (A % B = Result)";
        this.inputs.push(new NodePin(this, "A", "number"));
        this.inputs.push(new NodePin(this, "B", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    ModuloNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    	 
    ModuloNode.prototype.getValue = function(pin)
    {
        return this.inputs[0].connectee.parent.getValue(undefined) % this.inputs[1].connectee.parent.getValue(undefined);
    }
    
    ModuloNode.prototype.getCodeString = function()
    {    
        var finalCode = "(";
        var vars = []
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
        {       
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + " % ";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing B node */";
        else
        { 
            if(val[0].vars !== undefined) for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
    
    return ModuloNode;
})(BasicNode);

var IncrementNode = (function(_super)
{
    __extends(IncrementNode, _super);
    sidebar.AddToSidebar("IncrementNode", "Increment (++)", "Math", "nodesMath", 64, 64);
    function IncrementNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    IncrementNode.prototype.onCreate = function()
    {
        this.displayName = "Increment (Var++)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    IncrementNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'Var' parameter";
    }
    
    IncrementNode.prototype.execute = function()
    {
        this.setValue(this.inputs[1], parseFloat(this.getValue(this.inputs[1])) + 1);
        this.outputs[0].fire();
    }
	    	
    IncrementNode.prototype.getCodeString = function()
    {    
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
            val = val[0].code + "++"; 
        
        return [{ code: val, vars: val.vars }].concat(this.outputs[0].getCodeString());   
    }
    
    return IncrementNode;
})(BasicNode);

var DecrementNode = (function(_super)
{
    __extends(DecrementNode, _super);
    sidebar.AddToSidebar("DecrementNode", "Decrement (--)", "Math", "nodesMath", 128, 64);
    function DecrementNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DecrementNode.prototype.onCreate = function()
    {
        this.displayName = "Decrement (Var--)";
        this.inputs.push(new NodePin(this, "In", "flow"));
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Out", "flow"));
    }
    
    DecrementNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'Var' parameter";
    }
    
    DecrementNode.prototype.execute = function()
    {
        this.setValue(this.inputs[1], parseFloat(this.getValue(this.inputs[1])) - 1);
        this.outputs[0].fire();
    }
    
    DecrementNode.prototype.getCodeString = function()
    {    
        var val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
            val = val[0].code + "--"; 
        
        return [{ code: val, vars: val.vars }].concat(this.outputs[0].getCodeString());   
    }
	    		
    return DecrementNode;
})(BasicNode);

var IncrementInlineNode = (function(_super)
{
    __extends(IncrementInlineNode, _super);
    sidebar.AddToSidebar("IncrementInlineNode", "Increment Inline (++)", "Math", "nodesMath", 196, 64);
    function IncrementInlineNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    IncrementInlineNode.prototype.onCreate = function()
    {
        this.displayName = "Increment Inline (Var++)";
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    IncrementInlineNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'Var' parameter";
    }
    
    IncrementInlineNode.prototype.getValue = function(pin)
    {
        if(this.inputs[0].connectee !== undefined)
        {
            if(_WCState === 1)
                this.inputs[0].connectee.parent.setValue(undefined, this.inputs[0].connectee.parent.getValue() + 1);
            return this.inputs[0].connectee.parent.getValue();
        }
        
        return undefined;
    }
	    		
    IncrementInlineNode.prototype.getCodeString = function()
    {    
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
            val = val[0].code + "++"; 
        
        return [{ code: val, vars: val.vars }];   
    }
    
    return IncrementInlineNode;
})(BasicNode);

var DecrementInlineNode = (function(_super)
{
    __extends(DecrementInlineNode, _super);
    sidebar.AddToSidebar("DecrementInlineNode", "Decrement Inline (--)", "Math", "nodesMath", 0, 128);
    function DecrementInlineNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    DecrementInlineNode.prototype.onCreate = function()
    {
        this.displayName = "Decrement Inline (Var++)";
        this.inputs.push(new NodePin(this, "Var", "number"));
        this.outputs.push(new NodePin(this, "Result", "number"));
    }
    
    DecrementInlineNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'Var' parameter";
    }
    
    DecrementInlineNode.prototype.getValue = function(pin)
    {
        if(this.inputs[0].connectee !== undefined)
        {
            if(_WCState === 1)
                this.inputs[0].connectee.parent.setValue(undefined, this.inputs[0].connectee.parent.getValue() - 1);
            return this.inputs[0].connectee.parent.getValue();
        }
        
        return undefined;
    }
    
    DecrementInlineNode.prototype.getCodeString = function()
    {    
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing A node */";
        else
            val = val[0].code + "++"; 
        
        return [{ code: val, vars: val.vars }];   
    }
	    		
    return DecrementInlineNode;
})(BasicNode);