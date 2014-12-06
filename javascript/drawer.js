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