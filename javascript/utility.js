/*****************************************************************************************************************************************
 * Fault Tree Viewer for 08240 ACW 2014
 *
 * Misc utility functions
 *
 * Written by Daniel Masterson 446870
 *****************************************************************************************************************************************/

//Resets the camera position and zoom. If bQuick is true, doesn't animate the transition
function ResetCamera(bQuick)
{
	targetPanPosition = new Vector(canvas.width / 2, 128);
	targetZoomLevel = 1;
	
	if(bQuick === true)
	{
		actualPanPosition = targetPanPosition.Copy();
		actualZoomLevel = targetZoomLevel;
	}
}

//When the document is resized
function OnResize()
{
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

//Draw a polygon of 'N' sides with a center of x and y and a radius of r
function DrawNPoly(x, y, r, N)
{
	ctx.beginPath();
	ctx.moveTo(x, y - r);
	for(var n = 0; n < N; n++)
	{
		ctx.lineTo(x + r * Math.cos(2 * Math.PI * (n / N) - Math.PI / 2),
				   y + r * Math.sin(2 * Math.PI * (n / N) - Math.PI / 2));
	}
	ctx.closePath();
}

//Linearly interpolates between 'a' and 'b' via alpha
function Lerp(a, b, alpha)
{
	return a + (b - a) * alpha;	
}

//Linearly interpolates between color 'a' and 'b' via alpha
function ColorLerp(a, b, alpha)
{
	var aR = 0, aG = 0, aB = 0, aA = 1, bR = 0, bG = 0, bB = 0, bA = 1;
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
		aA = parseFloat(aSplit[3].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
		aA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	if(b.substr(0, 4) == "rgba")
	{
		b = b.substr(4).trim();
		b = b.substr(1, b.length - 2); //Get rid of brackets
		var bSplit = b.split(",");
		bR = parseInt(bSplit[0].trim());
		bG = parseInt(bSplit[1].trim());
		bB = parseInt(bSplit[2].trim());
		bA = parseFloat(bSplit[3].trim());
	}
	else if(b[0] == "#")
	{
		b = parseInt(b.substr(1), 16);
		bR = (b & 0xFF0000) >> 16;
		bG = (b & 0x00FF00) >> 8;
		bB = (b & 0x0000FF);
		bA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	var fR = parseInt(Lerp(aR, bR, alpha));
	var fG = parseInt(Lerp(aG, bG, alpha));
	var fB = parseInt(Lerp(aB, bB, alpha));
	var fA = parseFloat(Lerp(aA, bA, alpha));
	
	return "rgba(" + fR + "," + fG + "," + fB + "," + fA + ")";
}

//Darkens the supplied amount by [alpha] percentage
function ColorDarken(a, alpha)
{
	if(alpha == undefined)
		alpha = 0.8;
		
	var aR = 0, aG = 0, aB = 0, aA = 1;
				
	if(a.substr(0, 4) == "rgba")
	{
		a = a.substr(4).trim();
		a = a.substr(1, a.length - 2); //get rid of brackets
		var aSplit = a.split(",");
		aR = parseInt(aSplit[0].trim());
		aG = parseInt(aSplit[1].trim());
		aB = parseInt(aSplit[2].trim());
		aA = parseFloat(aSplit[3].trim());
	}
	else if(a[0] == "#")
	{
		a = parseInt(a.substr(1), 16);
		aR = (a & 0xFF0000) >> 16;
		aG = (a & 0x00FF00) >> 8;
		aB = (a & 0x0000FF);
		aA = 1;
	}
	else
	{
		return a; //Can't parse color
	}
	
	aR = Math.max(Math.min(aR * alpha, 255), 0);
	aG = Math.max(Math.min(aG * alpha, 255), 0);
	aB = Math.max(Math.min(aB * alpha, 255), 0);
	
	return "rgba(" + aR + "," + aG + "," + aB + "," + aA + ")";
}