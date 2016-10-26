/*jshint esversion: 6 */
/*
label.js
========
Contains methods that give GoDex EZPL commands for priting labels elements.
*/
import _ from 'underscore';
import Element from './elements/Element';
import Rect from './elements/Rectangle';
import LineHor from './elements/LineHor';
import LineVer from './elements/LineVer';
import Text from './elements/Text';
import Barcode from './elements/Barcode';

export default class Label{
   constructor(copies = 1, width = 80, height = 52, gap = 2, leftMargin= 26, rowOffset= -15, startPos= 20){

      this.copies = 1;
      this.width = width;
      this.height = height;
      this.gap = gap;
      this.leftMargin = leftMargin;
      this.rowOffset = rowOffset;
      this.startPos = startPos;
      // Hold list of babel elements
      this.labelEle = [];

      this.set = {
         copies: x=>{this.copies = x;}
      };

      this.cmd = {
         copies: ()=>{return `^C${this.copies}\n`;},
         labelDim: ()=>{return `^W${this.width}\n^Q${this.height},${this.gap}\n`;},
         leftMargin: ()=>{return `^R${this.leftMargin}\n`;},
         rowOffset: ()=>{return `~Q${this.rowOffset}\n`;},
         startPos: ()=>{return `^E${this.startPos}\n`;},
         startLabelNormal: ()=>{return '^L\n';},   // if mode = 0 || undefined
         startLabelInverse: ()=>{return '^LI\n';}, // if mode = 1
         startLabelMirror: ()=>{return '^LM\n';}  // if mode = 2
      };

      this.set = {
         copies : x=>{this.copies = x;},
         width : x=>{ this.width = x;},
         height : x=>{this.height = x;},
         gap : x=>{this.gap = x;},
         leftMargin : x=>{this.leftMargin = x;},
         rowOffset : x=>{this.rowOffset = x;},
         startPos : x=>{this.startPos = x;}
      };
   }

   addLabelElement(element){
      if(element instanceof Element)
         this.labelEle.push(element);
   }

   // Horizontal line commmand
   addLineHor(xStart,xEnd,y,t){
      this.addLabelElement(new LineHor(xStart,xEnd,y,t));
   }

   addLineVer(x,yStart,yEnd,t){
      this.addLabelElement(new LineVer(x,yStart,yEnd,t));
   }

   addRect(xStart, yStart, width, height, t){
      this.addLabelElement(new Rect(xStart, yStart, width, height, t));
   }

   // Text command
   addText(text, xStart, yStart, size){
      this.addLabelElement(new Text(text, xStart, yStart, size));
   }

   addBarcode(type, x, y, narrow, width, height, data){
      this.addLabelElement(new Barcode(type, x, y, narrow, width, height, 0, 0, data));
   }

   getPrintCommand(dpi=203, mode = 0){
      var cmd = "";
      for(var element of this.labelEle){
         cmd += element.getPrintCommand(dpi);
      }
      return cmd;
   }

   getPrintCommandPrefix(mode=0){
      var prefix =   this.cmd.copies() +
                     (mode===0? this.cmd.startLabelNormal() : (mode===1? this.cmd.startLabelInverse() : this.cmd.startLabelMirror())) + this.cmd.labelDim() +
                     this.cmd.leftMargin() +
                     this.cmd.rowOffset() +
                     this.cmd.startPos();
      return prefix;
   }
}
