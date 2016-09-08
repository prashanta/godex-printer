/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';
import Element from './Element';

export default class Barcode extends Element{

   constructor(type, x, y, narrow, width, height, rotation, readable, data){
      super();
      this.barType = {'CODE39': 'A', 'EAN8': 'B', 'EAN13':'E', 'UPCA':'H', 'UPCE':'K', 'CODE93':'P', 'CODE128':'Q'};
      this.type = barType[type];
      this.xStart = x;
      this.yStart = y;
      this.narrow = narrow;
      this.width = narrow;
      this.height = narrow;
      this.rotation = rotation;
      this.readable = readable;
      this.data = data;
   }

   getPrintCommand(dpi=203){
      super(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart),
            narrowDot = this.toDot(this.narrow),
            widthDot = this.toDot(this.width),
            heightDot = this.toDot(this.height);

      return `B${this.type},${xStartDot},${yStartDot},${narrowDot},${widthDot},${heightDot},${this.rotation},${this.readable},${this.data}\n`;
   }
}
