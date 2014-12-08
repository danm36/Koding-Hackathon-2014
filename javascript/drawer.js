$(function() {
    $("#tabs span").click(function() {
        $("#tabs span.active").removeClass("active");
        $("#drawerContent div.active").removeClass("active");

        $(this).addClass("active");
        $("#drawerContent #" + $(this).data("tab")).addClass("active");
    });
});

console.oldlog = console.log;
console.oldinfo = console.info;
console.oldwarn = console.warn;
console.olderror = console.error;
console.oldclear = console.clear;

console.log = function(str)
{
    console.oldlog(str);
    drawerConsoleWrite(str, "#000000");
}

console.info = function(str)
{
    console.oldinfo(str);
    drawerConsoleWrite(str, "#0000FF");
}

console.warn = function(str)
{
    console.oldwarn(str);
    drawerConsoleWrite(str, "#FFAA00");
}

console.error = function(str)
{
    console.olderror(str);
    drawerConsoleWrite(str, "#FF0000");
}

console.clear = function()
{
    console.oldclear();
    $("#drawerContent #console #consoleOutput").empty();
    drawerConsoleWrite("Console Cleared...", "#BBBBBB");
}

function drawerConsoleWrite(str, col)
{
    var bottomLocked = $("#drawerContent").scrollTop() == $("#drawerContent")[0].scrollHeight - $("#drawerContent")[0].offsetHeight;
    $("#drawerContent #console #consoleOutput").append("<div class=\"logRow\" style=\"color: " + col + ";\">" + str  + "</div>");
    if(bottomLocked)
        $("#drawerContent").scrollTop($("#drawerContent")[0].scrollHeight);
}

function drawerConsoleKeyDown(e)
{
    e = e || window.event;
    if(e.keyCode == 13) //Enter key pressed
    {
        var val = $("#consoleInput").val();
        drawerConsoleWrite("> " + val, "#666666");
        try
        {
            console.log(eval(val));
        }
        catch(err)
        {
            console.error(err);   
        }
        $("#consoleInput").val("");
    }        
}


function SelectNodeProperties(node)
{
    if(!(node instanceof BasicNode))
        return;
    
    var toAppend = "<h2>" + node.displayName + "</h2>";
    toAppend += "<table class='propertyGrid'><tbody>";
    
    var bHasProperty = false;
    for(var prop in node.properties)
    {
        bHasProperty = true;
        switch(node.properties[prop].type.toLowerCase())
        {
            default:
            case "string":
                toAppend += "<tr><td>" + prop + "</td><td><input type=\"text\" onkeyup=\"UpdateNodeProp(this, '" + prop + "', 'string');\" value=\"" + node.properties[prop].value + "\" /></td></tr>";
                break;
            case "bool":
                toAppend += "<tr><td>" + prop + "</td><td><input type=\"checkbox\" onchange=\"UpdateNodeProp(this, '" + prop + "', 'bool');\" value=\"true\" " + (node.properties[prop].value == true ? "checked" : "") + "/></td></tr>";
                break;
            case "number":
                toAppend += "<tr><td>" + prop + "</td><td><input type=\"number\" onkeyup=\"UpdateNodeProp(this, '" + prop + "', 'number');\" onchange=\"UpdateNodeProp(this, '" + prop + "', 'number');\" value=\"" + node.properties[prop].value + "\" step=\"" + (node.properties[prop].step || "any") + "\" " + (node.properties[prop].min !== undefined ? "min=\"" + node.properties[prop].min + "\"" : "") + "  " + (node.properties[prop].max !== undefined ? "max=\"" + node.properties[prop].max + "\"" : "") + " /></td></tr>";
                break;
            case "object":
                toAppend += "<tr><td>" + prop + "</td><td>Objects not currently handled</td></tr>";
                break; 
            case "array":
                toAppend += "<tr><td>" + prop + "</td><td>Arrays not currently handled</td></tr>";
                break; 
        }
    }
    
    if(!bHasProperty)
        toAppend += "<tr><td colspan=\"2\" style=\"text-align: center; padding: 10px 0px;\">This node has no configurable properties</td></tr>";
    
    toAppend += "</tbody></table>";
    $("#propArea").append(toAppend);
}

var lastUpdateNode;
function UpdateNodeProp(el, prop, type)
{
    if(lastUpdateNode == undefined)
        return;
    
    if(type == "bool")
    {
        lastUpdateNode.properties[prop].value = el.checked;
    }
    else if(type == "number")
    {
        val = parseFloat(el.value);
        
        if(lastUpdateNode.properties[prop].max !== undefined)
            val = Math.min(val, selectedEl.properties[prop].max);
        if(lastUpdateNode.properties[prop].min !== undefined)
            val = Math.max(val, selectedEl.properties[prop].min);
        if(lastUpdateNode.properties[prop].step !== undefined)
            val = Math.round(val / selectedEl.properties[prop].step) * selectedEl.properties[prop].step;
        
        el.value = val;
        lastUpdateNode.properties[prop].value = parseFloat(val);
    }
    else
    {
        lastUpdateNode.properties[prop].value = el.value;
    }
    lastUpdateNode.reset();
    RefreshCode(true);
}


var lastErrors = [];
var curErrors = [];
function AddError(node, message)
{
    curErrors.push({node: node, message: message});
}

function CheckForNewErrors()
{
    var changeHappened = false;
    var addedErrors = curErrors.filter(function(el)
    {
        for(var i = 0; i < lastErrors.length; i++)
        {
            if(curErrors[i].node == el.node && curErrors[i].message == el.message)
            {
                return false;
            }
        }

        return true;
    });
    
    var removedErrors = lastErrors.filter(function(el)
    {
        for(var i = 0; i < curErrors.length; i++)
        {
            if(curErrors[i].node == el.node && curErrors[i].message == el.message)
            {
                return false;
            }
        }

        return true;
    });
            
    //console.log(diffErrors);
    if(addedErrors.length > 0 || removedErrors.length > 0) //Change has happened
    {
        $("#errorOutput").empty();      
        
        if(curErrors.length > 0)
        {
            $("#errorListTabBtn").addClass("errored");
            
            var toAppend = "";
            for(var i = 0; i < curErrors.length; i++)
                toAppend += "<div class=\"logRow\" style=\"color: #FF0000;\">[" + curErrors[i].node.constructor.name + "@" + curErrors[i].node.getId() + "] " + curErrors[i].message  + "<span class=\"logLink\" onclick=\"SelectNode(" + curErrors[i].node.getId() + ", true);\">Highlight Node</span></div>";           
            $("#errorOutput").append(toAppend);
        }
        else
        {
            $("#errorListTabBtn").removeClass("errored");
            $("#errorOutput").append("<div class=\"logRow\" style=\"color: #1BAE1B;\">No errors!</div>");
        }
    }
        
    lastErrors = curErrors;
    curErrors = [];
}

function RefreshCode(isAuto, isDelayed)
{
    if(isAuto === true && !$("#codeAutoRefreshCheck").is(":checked"))
        return;
    
    if(isAuto === true && isDelayed !== true)
    {
        //So errors can self resolve
        setTimeout(function() { RefreshCode(true, true); }, 50);
        return;
    }
    
    if(lastErrors.length > 0)
    {
        if(isAuto !== true)
            console.warn("Failed to generate code - There are some errors present");
        return;
    }
    
    $("#generatedCode #codeOutput").empty();
    var toAppend = "";
    var indentLevel = 0;
    for(var n = 0; n < _workspace.length; n++)
    {
        if(_workspace[n] instanceof MainFunctionNode || _workspace[n] instanceof FunctionNode)
        {
            var cs = _workspace[n].getCodeString();
            var seenVars = [];
            for(var i = 0; i < cs.length; i++)
            {
                if(cs[i] === undefined)
                    break;
                
                if(cs[i].vars !== undefined)
                {
                    for(var j = 0; j < cs[i].vars.length; j++)
                    {
                        if(seenVars.indexOf(cs[i].vars[j].name) < 0)
                        {
                            toAppend += "<div class=\"logRow\">" + ("var " + cs[i].vars[j].name + " = " + cs[i].vars[j].default + ";").addLeft(indentLevel * 4, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>";
                            seenVars.push(cs[i].vars[j].name);
                        }
                    }
                }
                
                if(cs[i].code !== undefined)
                    toAppend += "<div class=\"logRow\">" + cs[i].code.addLeft(indentLevel * 4, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + (cs[i].dontsemi !== true ? ";" : "") +  "</div>";
                
                if(cs[i].indent === true)
                {                
                    toAppend += "<div class=\"logRow\">" + "{".addLeft(indentLevel * 4, "&nbsp;") + "</div>";
                    indentLevel++;
                }
                else if(cs[i].exdent === true)
                {
                    indentLevel--;
                    toAppend += "<div class=\"logRow\">" + "}".addLeft(indentLevel * 4, "&nbsp;") + "</div>";                 
                }
            }
            
            while(indentLevel > 0)
            {
                indentLevel--;
                toAppend += "<div class=\"logRow\">" + "}".addLeft(indentLevel * 4, "&nbsp;") + "</div>";    
            }
            toAppend += "<div class=\"logRow\">&nbsp;</div>"; 
        }
    }
    
    
    $("#generatedCode #codeOutput").append(toAppend);
}