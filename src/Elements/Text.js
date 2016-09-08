/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';
import Element from './Element';

export default class Text extends Element{

   constructor(text, xStart, yStart, size){
      super();
      this.text = text;
      this.xStart = xStart;
      this.yStart = yStart;
      this.size = size;
   }

   getPrintCommand(dpi=203){
      super(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart),
            sizePoint = Math.floor(this.size * 2.84), // convert from mm to points
            i = [6, 8, 10, 12, 14, 18, 24, 30],
            j = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      // Get closest matching size
      var k = _.map(i, function(num){ return Math.abs(num - sizePoint); });
      var l = _.lastIndexOf(k, _.min(k));
      return `A${j[l]},${xStartDot},${yStartDot},1,1,1,0,${text}\n`;
   }
}
