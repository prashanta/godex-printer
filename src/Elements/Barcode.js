/*jshint esversion: 6 */
/*
Barcode.js
==========
Barcode label element.
*/
import _ from 'underscore';
import Element from './Element';

export default class Barcode extends Element{

   constructor(type, x, y, narrow, width, height, rotation, readable, data){
      super();
      this.barType = {'CODE39': 'A', 'EAN8': 'B', 'EAN13':'E', 'UPCA':'H', 'UPCE':'K', 'CODE93':'P', 'CODE128':'Q'};
      this.type = this.barType[type];
      this.xStart = x;
      this.yStart = y;
      this.narrow = narrow;
      this.width = width;
      this.height = height;
      this.rotation = rotation;
      this.readable = readable;
      this.data = data;
   }

   getPrintCommand(dpi=203){
      super.getPrintCommand(dpi);
      var   xStartDot = this.toDot(this.xStart),
            yStartDot = this.toDot(this.yStart),
            narrowDot = this.toDot(this.narrow),
            widthDot = this.toDot(this.width),
            heightDot = this.toDot(this.height);

      return `B${this.type},${xStartDot},${yStartDot},${narrowDot},${widthDot},${heightDot},${this.rotation},${this.readable},${this.data}\n`;
   }
}
