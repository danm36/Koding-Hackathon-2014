/*****************************************************************************************************************************************
 * Fault Tree Viewer for 08240 ACW 2014
 *
 * Vector file
 *
 * Written by Daniel Masterson 446870
 *****************************************************************************************************************************************/

var Vector = (function()
{
	function Vector(pX, pY)
	{
        //I'm using actual variables in mimicry of XNA's Vector2 and is helps lower the amount of typing needed
		this.x = pX ? pX : 0;
		this.y = pY ? pY : 0;
	};
	
	Vector.prototype.Copy = function() //Create a new instance
    {
		return new Vector(this.x, this.y);
	};
	
	Vector.prototype.Length = function()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};
    
    Vector.prototype.LengthSquared = function() //In case we don't want to do an expensive SqRt
	{
		return (this.x * this.x) + (this.y * this.y);
	};
	
	Vector.prototype.Distance = function(other) //The distance between two vectors
	{
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}
	
	Vector.prototype.GetNormalized = function() //Creates a new vector that is this one normalized
	{
		return new Vector(	this.x / this.Length(),
							this.y / this.Length());
	}
	
	Vector.prototype.Normalize = function() //Normalizes without creating a new instance
	{
		this.x /= this.Length();
		this.y /= this.Length();
		return this;
	}
	
	Vector.prototype.Add = function(other) //Adds a vector value - Creates a new instance to make things simpler
	{
		return new Vector(this.x + other.x, this.y + other.y);	
	}
	
	Vector.prototype.Subtract = function(other) //Subtracts a vector value - Creates a new instance to make things simpler
	{
		return new Vector(this.x - other.x, this.y - other.y);	
	}
	
	Vector.prototype.Multiply = function(other) //Multiplies a vector or scalar value - Creates a new instance to make things simpler
	{
		if(other instanceof Vector)
			return new Vector(this.x * other.x, this.y * other.y);
		else
			return new Vector(this.x * other, this.y * other);
	}
		
	Vector.prototype.Divide = function(other) //Multiplies a vector or scalar value - Creates a new instance to make things simpler
	{
		if(other instanceof Vector)
			return new Vector(this.x / other.x, this.y / other.y);
		else
			return new Vector(this.x / other, this.y / other);
	}
	
	Vector.prototype.Lerp = function(other, alpha) //Lerps this vector with a new vector - Returns a new instance
	{
		if(other instanceof Vector && !isNaN(parseFloat(alpha)) && isFinite(parseFloat(alpha)))
		{
			alpha = parseFloat(alpha);
			var nX = this.x + (other.x - this.x) * alpha;	
			var nY = this.y + (other.y - this.y) * alpha;	
			return new Vector(nX, nY);
		}
		
		return this;
	}
	
	return Vector;
})();