/*****************************************************************************************************************************************
 * WireCoder
 *
 * String nodes to handle various string manipulation functions
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var StrToUpperCaseNode = (function(_super)
{
    __extends(StrToUpperCaseNode, _super);
    sidebar.AddToSidebar("StrToUpperCaseNode", "To Upper Case", "String");
    function StrToUpperCaseNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrToUpperCaseNode.prototype.onCreate = function()
    {
        this.displayName = "To Upper Case";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.outputs.push(new NodePin(this, "Result", "string"));
    }
    
    StrToUpperCaseNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    StrToUpperCaseNode.prototype.getValue = function(pin)
    {
        return String(this.inputs[0].getValue()).toUpperCase();
    }
    
    StrToUpperCaseNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrToUpperCaseNode.prototype.getCodeString = function()
    {        
        var val = this.inputs[0].getCodeString();
        var vars = [];
        
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        return [{ code: val + ".toUpperCase()", vars: vars }];   
    }
	    		
    return StrToUpperCaseNode;
})(BasicNode);

var StrToLowerCaseNode = (function(_super)
{
    __extends(StrToLowerCaseNode, _super);
    sidebar.AddToSidebar("StrToLowerCaseNode", "To Lower Case", "String");
    function StrToLowerCaseNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrToLowerCaseNode.prototype.onCreate = function()
    {
        this.displayName = "To Lower Case";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.outputs.push(new NodePin(this, "Result", "string"));
    }
    
    StrToLowerCaseNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    StrToLowerCaseNode.prototype.getValue = function(pin)
    {
        return String(this.inputs[0].getValue()).toLowerCase();
    }
    
    StrToLowerCaseNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrToLowerCaseNode.prototype.getCodeString = function()
    {        
        var val = this.inputs[0].getCodeString();
        var vars = [];
        
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        return [{ code: val + ".toLowerCase()", vars: vars }];   
    }
	    		
    return StrToLowerCaseNode;
})(BasicNode);

var StrConcatNode = (function(_super)
{
    __extends(StrConcatNode, _super);
    sidebar.AddToSidebar("StrConcatNode", "Concatenate", "String");
    function StrConcatNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrConcatNode.prototype.onCreate = function()
    {
        this.displayName = "Concatenate";
        this.inputs.push(new NodePin(this, "A", "string"));
        this.inputs.push(new NodePin(this, "B", "string"));
        this.outputs.push(new NodePin(this, "Result", "string"));
    }
    
    StrConcatNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'A' parameter";
        else if(this.inputs[1].getValue() == undefined)
            this.curError = "Missing 'B' parameter";
    }
    
    StrConcatNode.prototype.getValue = function(pin)
    {
        return String(this.inputs[0].getValue()).concat(this.inputs[1].getValue());
    }
    
    StrConcatNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrConcatNode.prototype.getCodeString = function()
    {        
        var val1 = this.inputs[0].getCodeString();
        var vars = [];
        
        if(val1 === undefined)
            val1 = "/* Error, missing String 1 node */";
        else
        {
            for(var i = 0; i < val1[0].vars.length; i++) vars.push(val1[0].vars[i]); 
            val1 = val1[0].code;  
        }
        
        var val2 = this.inputs[1].getCodeString();
        if(val2 === undefined)
            val2 = "/* Error, missing String 2 node */";
        else
        {
            for(var i = 0; i < val2[0].vars.length; i++) vars.push(val2[0].vars[i]); 
            val2 = val2[0].code; 
        }
        
        return [{ code: val1 + ".concat(" + val2 + ")", vars: vars }];   
    }
	    		
    return StrConcatNode;
})(BasicNode);

var StrIndexOfNode = (function(_super)
{
    __extends(StrIndexOfNode, _super);
    sidebar.AddToSidebar("StrIndexOfNode", "Index Of", "String");
    function StrIndexOfNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrIndexOfNode.prototype.onCreate = function()
    {
        this.displayName = "Index Of";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.inputs.push(new NodePin(this, "Search", "string"));
        this.outputs.push(new NodePin(this, "Result", "number"));
        
        this.properties = {
            search: { type: "string", value: "" },
        };
    }
    
    StrIndexOfNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    StrIndexOfNode.prototype.getValue = function(pin)
    {
        return String(this.inputs[0].getValue()).indexOf(this.inputs[1].getValue() || this.properties.search.value);
    }
    
    StrIndexOfNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrIndexOfNode.prototype.getCodeString = function()
    {    
        var finalCode = "";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val + ".indexOf(";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing Search node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }    
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return StrIndexOfNode;
})(BasicNode);

var StrLastIndexOfNode = (function(_super)
{
    __extends(StrLastIndexOfNode, _super);
    sidebar.AddToSidebar("StrLastIndexOfNode", "Last Index Of", "String");
    function StrLastIndexOfNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrLastIndexOfNode.prototype.onCreate = function()
    {
        this.displayName = "Last Index Of";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.inputs.push(new NodePin(this, "Search", "string"));
        this.outputs.push(new NodePin(this, "Result", "number"));
        
        this.properties = {
            search: { type: "string", value: "" },
        };
    }
    
    StrLastIndexOfNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    StrLastIndexOfNode.prototype.getValue = function(pin)
    {
        return String(this.inputs[0].getValue()).lastIndexOf(this.inputs[1].getValue() || this.properties.search.value);
    }
    
    StrLastIndexOfNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrLastIndexOfNode.prototype.getCodeString = function()
    {    
        var finalCode = "";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ".lastIndexOf(";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing Search node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return StrLastIndexOfNode;
})(BasicNode);


var SubstrNode = (function(_super)
{
    __extends(SubstrNode, _super);
    sidebar.AddToSidebar("SubstrNode", "Substring", "String");
    function SubstrNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    SubstrNode.prototype.onCreate = function()
    {
        this.displayName = "Substring";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.inputs.push(new NodePin(this, "Start", "number"));
        this.inputs.push(new NodePin(this, "Length", "number"));
        this.outputs.push(new NodePin(this, "Result", "string"));
        
        this.properties = {
            start: { type: "number", value: 0, min: 0, step: 1 },
            length: { type: "number", value: -1, min: -1, step: 1 },
        };
    }
    
    SubstrNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    SubstrNode.prototype.getValue = function(pin)
    {
        var length = this.inputs[2].getValue() || this.properties.length.value;
        if(length === undefined && length < 1)
            length = undefined;
        return String(this.inputs[0].getValue()).substr(this.inputs[1].getValue() || this.properties.start.value, length);
    }
    
    SubstrNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    SubstrNode.prototype.getCodeString = function()
    {    
        var finalCode = "";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        
        finalCode += val + ".subsr(";
        
        val = this.inputs[1].getCodeString();
        if(val === undefined)
            val = "/* Error, missing Start node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val;
        
        val = this.inputs[2].getCodeString();
        if(val !== undefined)
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
            finalCode += ", " + val;
        }
        
        finalCode += ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return SubstrNode;
})(BasicNode);

var StrReplaceNode = (function(_super)
{
    __extends(StrReplaceNode, _super);
    sidebar.AddToSidebar("StrReplaceNode", "Replace", "String");
    function StrReplaceNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    StrReplaceNode.prototype.onCreate = function()
    {
        this.displayName = "Substring";
        this.inputs.push(new NodePin(this, "String", "string"));
        this.inputs.push(new NodePin(this, "Search", "string"));
        this.inputs.push(new NodePin(this, "Replace", "string"));
        this.outputs.push(new NodePin(this, "Result", "string"));
        
        this.properties = {
            search: { type: "string", value: "" },
            replace: { type: "string", value: "" },
            globalSearch: { type: "bool", value: true },
            insensitiveSearch: { type: "bool", value: false },
        };
    }
    
    StrReplaceNode.prototype.reset = function()
    {
        this.curError = undefined;
        
        if(this.inputs[0].getValue() == undefined)
            this.curError = "Missing 'String' parameter";
    }
    
    StrReplaceNode.prototype.getValue = function(pin)
    {
        var regex = new RegExp(this.inputs[1].getValue() || this.properties.search.value, (this.properties.globalSearch.value === true ? "g" : "") + (this.properties.insensitiveSearch.value === true ? "i" : ""));
        return String(this.inputs[0].getValue()).replace(regex, this.inputs[2].getValue() || this.properties.replace.value);
    }
    
    StrReplaceNode.prototype.execute = function()
    {
        this.setValue(this.outputs[0], this.getValue());
    }
    
    StrReplaceNode.prototype.getCodeString = function()
    {
        var regexCode = "new RegExp(";
        var finalCode = "";
        var vars = [];
        
        var val = this.inputs[0].getCodeString();
        if(val === undefined)
            val = "/* Error, missing String node */";
        else
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;  
        }
        
        finalCode += val;
        
        val = this.inputs[1].getCodeString() || this.properties.search.value;
        if(val === undefined || val == "")
            val = "/* Error, missing Search node */";
        else if(val instanceof Object)
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code;   
        }
        else
            val = "\"" + val + "\"";
        
        regexCode += val + ", \"" + (this.properties.globalSearch.value === true ? "g": "") + (this.properties.insensitiveSearch.value === true ? "i": "") + "\")";
        finalCode += ".replace(" + regexCode +", ";
        
        val = this.inputs[2].getCodeString() || this.properties.replace.value;
        if(val === undefined || val == "")
            val = "/* Error, missing Replace node */";
        else if(val instanceof Object)
        {
            for(var i = 0; i < val[0].vars.length; i++) vars.push(val[0].vars[i]); 
            val = val[0].code; 
        }
        else
            val = "\"" + val + "\"";
        
        finalCode += val + ")";
        
        return [{ code: finalCode, vars: vars }];   
    }
	    		
    return StrReplaceNode;
})(BasicNode);