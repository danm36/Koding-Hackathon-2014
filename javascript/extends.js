/*****************************************************************************************************************************************
 * WireCoder
 *
 * Extends functionality
 *
 * Written by Daniel Masterson [Axon] for the Koding 2014 Hackathon - http://udkk231b936d.danm36.koding.io/
 *****************************************************************************************************************************************/


var __extends = this.__extends || function (child, parent)
{
	function Proxy() { this.constructor = child; }
	Proxy.prototype = parent.prototype;
	child.prototype = new Proxy();
}
