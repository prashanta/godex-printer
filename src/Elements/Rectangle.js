/*jshint esversion: 6 */
/*
Rectangle.js
============
Rectangle label element.
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
      super.getPrintCommand(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart),
            widthDot = this.toDot(this.width),
            heightDot = this.toDot(this.height),
            thickDot = this.toDot(this.thick);

      return `R${xStartDot},${yStartDot},${xStartDot + widthDot},${yStartDot + heightDot},${thickDot},${thickDot}\n`;
   }
}
