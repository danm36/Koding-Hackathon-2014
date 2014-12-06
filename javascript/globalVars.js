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
var mouseDown = false;
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
    
    pinFillColor: {
        flow: "#000000",
        var: "#FF00FF",
        string: "#00FF00",
        number: "#0000FF",
        object: "#FFFF00",
        array: "#00FFFF",
    }
};

var hoveringEl = undefined;
var draggingEl = undefined;