/*jshint esversion: 6 */
/*
LineVer.js
==========
Vertical line label element.
*/
import _ from 'underscore';
import Element from './Element';

export default class LineVer extends Element{

   constructor(x, yStart, yEnd, t){
      super();

      this.xStart = x;
      this. yStart = yStart;
      this.xEnd = x + t;
      this.yEnd = yEnd;
      this.thick = t;
   }

   getPrintCommand(dpi=203){
      super.getPrintCommand(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart),
            xEndDot = this.toDot(this.xEnd),
            yEndDot = this.toDot(this.yEnd),
            thickDot = this.toDot(this.thick);

      return `La,${xStartDot},${yStartDot},${xEndDot},${yEndDot}\n`;
   }
}
