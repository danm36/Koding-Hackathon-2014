/*****************************************************************************************************************************************
 * WireCoder
 *
 * Global variables file
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/

var canvas;
var ctx;

var _WCState = 0;
var _workspace = new Array();

var mousePosition;
var actualMousePosition;
var mouseDownPosition;
var mouseDown = false;
var lastMouseDownElement = undefined;
var ctrlDownOnDrag = false;

var targetPanPosition = new Vector(0, 0);
var actualPanPosition = new Vector(0, 0);
var targetZoomLevel = 1;
var actualZoomLevel = 1;

//Because pulling this from CSS is difficult
var styleData = {
	bgFill: "#FFFFFF",
	
	bgGradTopNorm: "#EEEEFF",
	bgGradBotNorm: "#CCCCFF",
	bgGradTopSimu: "#FFEFEF",
	bgGradBotSimu: "#FFCCCC",
    bgGradTopEdit: "#EEFFEE",
	bgGradBotEdit: "#BBCCBB",
	
	bgGradTopInterp: "#EEEEFF", //The actual values to draw the background with, which are interpolated
	bgGradBotInterp: "#CCCCFF", //from the values above
    
    nodeStroke: "#000000",
	nodeFill: "#FFFFFF",
	nodeFillActive: "#FF9900",
    nodeSelectionGlow: "#6666FF",
    
    pinFillColor: {
        flow: "#000000",
        var: "#FF00FF",
        bool: "#FFAA00",
        string: "#00CC00",
        number: "#0000FF",
        object: "#FFFF00",
        array: "#00FFFF",
    }
};

var nodePinTypeSupports = {
    var: ["string", "number", "bool", "object", "array"],
    string: ["number", "bool", "var"],
    bool: ["var"],
    number: ["var"],
    object: ["var"],
    array: ["var"]
}

var hoveringEl = undefined;
var draggingEl = undefined;
var selectedEl = undefined;