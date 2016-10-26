/*jshint esversion: 6 */
/*
LineHor.js
==========
Horizontal line label element.
*/
import _ from 'underscore';
import Element from './Element';

export default class LineHor extends Element{

   constructor(xStart, xEnd, y, t){
      super();
      this.xStart = xStart;
      this. yStart = y;
      this.xEnd = xEnd;
      this.yEnd = y + t;
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
