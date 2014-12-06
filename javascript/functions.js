/*****************************************************************************************************************************************
 * WireCoder
 *
 * Function Nodes
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/
 
var FunctionNode = (function(_super)
{
    __extends(FunctionNode, _super);
    function FunctionNode(spawnPos)
	{
        _super.call(this, spawnPos);
    }
    
    FunctionNode.prototype.onCreate = function()
    {
        this.displayName = "Function";
        this.outputs.push(new NodePin(this, "Out", "flow"));
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
        if(_WCState === 0)
        {
            _WCState = 1;
            var self = this;
            setTimeout(function()
            {
                self.execute();
            }, 100);
        }
        else
        {
            this.bIsActive = false;   
        }
    }

    
    return MainFunctionNode;
})(BasicNode);
