/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';
import Element from './Element';

export default class LineHor extends Element{

   constructor(xStart, xEnd, t){
      super();
      this.xStart = xStart;
      this. yStart = y;
      this.xEnd = xEnd;
      this.yEnd = y + t;
      this.thick = t;
   }

   getPrintCommand(dpi=203){
      super();
      var   xStartDot = this.toDot(this.xStart, dpi),
            yStartDot = this.toDot(this.yStart, dpi),
            xEndDot = this.toDot(this.xEnd, dpi),
            yEndDot = this.toDot(this.yEnd, dpi),
            thickDot = this.toDot(this.thick, dpi);

      return `La,${xStartDot},${yStartDot},${xEndDot},${yEndDot}\n`;
   }
}
