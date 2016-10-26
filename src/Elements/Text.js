/*jshint esversion: 6 */
/*
Text.js
=======
Text label element.
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
      this.mmToPoint = 3.5; // 1mm = 2.84 points
   }

   getPrintCommand(dpi=203){
      super.getPrintCommand(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart);
      var cmd = '';
      // If font size is less than 9 mm
      if(this.size < 9){
         var sizePoint = Math.floor(this.size * this.mmToPoint); // convert from mm to points

         var i = [6, 8, 10, 12, 14, 18, 24, 30];
         var j = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
         // Get closest matching size
         var k = _.map(i, function(num){ return Math.abs(num - sizePoint); });
         var l = _.lastIndexOf(k, _.min(k));
         cmd = `A${j[l]},${xStartDot},${yStartDot},1,1,1,0,${this.text}\n`;
      }
      else{
         var sizeDot = this.toDot(this.size);
         cmd = `AT,${xStartDot},${yStartDot},${sizeDot},${sizeDot},0,0,0,0,${this.text}\n`;
      }
      return cmd;
   }
}
