/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';
import Element from './Element';

export default class Rectangle extends Element{

   constructor(xStart, yStart, width, height, t){
      super();
      this.xStart = xStart;
      this.yStart = yStart;
      this.width = width;
      this.height = height;
      this.thick = t;
   }

   getPrintCommand(dpi=203){
      super();
      var   xStartDot = this.toDot(this.xStart, dpi),
            yStartDot = this.toDot(this.yStart, dpi),
            yWidthDot = this.toDot(this.width, dpi),
            yHeightDot = this.toDot(this.height, dpi),
            thickDot = this.toDot(this.thick, dpi);

      return `R${xStartDot},${yStartDot},${xStartDot+widthDot},${yStartDot + heightDot},${thickDot},${thickDot}\n`;
   }
}
