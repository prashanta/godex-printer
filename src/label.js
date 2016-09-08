/*jshint esversion: 6 */
/*
label.js
========
Contains methods that give GoDex EZPL commands for priting labels elements.
*/
import _ from 'underscore';
import Element from './elements/Element';

export default class Label{
   constructor({  speed= 2,
                  darkness= 5,
                  leftMargin= 26,
                  rotate= 150,
                  rowOffset= -25,
                  width= 80,
                  length= 52,
                  gap= 2,
                  startPos= 20,
                  copies= 1} = {}){

      this.config = {speed: speed, darkness: darkness, leftMargin: leftMargin, rotate: rotate, rowOffset: rowOffset, width: width, length: length, gap: gap, startPos: startPos, copies: copies};


      this.cmd = {
         speed : ()=>{return `^S${this.config.speed}\n`;},
         darkness: ()=>{return `^H${this.config.darkness}\n`;},
         leftMargin: ()=>{return `^R${this.config.leftMargin}\n`;},
         rotate: ()=>{return `~R${this.config.rotate}\n`;},
         rowOffset: ()=>{return `~Q${this.config.rowOffset}\n`;},
         labelDim: ()=>{return `^W${this.config.width}\n^Q${this.config.length},${this.config.gap}\n`;},
         startPos: ()=>{return `^E${this.config.startPos}\n`;},
         copies: ()=>{return `^C${this.config.copies}\n`;},

         startLabelNormal: ()=>{return '^L\n';},   // if mode = 0 || undefined
         startLabelInverse: ()=>{return '^LI\n';}, // if mode = 1
         startLabelMirror: ()=>{return '^LM\n';},  // if mode = 2
         end: ()=>{return 'E\n';}
      };

      this.set = {
         speed : x=>{this.config.speed = x;},
         darkness : x=>{this.config.darkness = x;},
         leftMargin : x=>{this.config.leftMargin = x;},
         rotate : x=>{this.config.rotate = x;},
         rowOffset : x=>{this.config.rowOffset = x;},
         width : x=>{ this.config.width = x;},
         length : x=>{this.config.length = x;},
         gap : x=>{this.config.gap = x;},
         startPos : x=>{this.config.startPos = x;},
         copies: x=>{this.config.copies = x;}
      };
      // Hold list of babel elements
      this.labelEle = [];
   }

   addLabelElement(element){
      if(element instanceof Element)
         this.labelEle.push(element);
   }


   getPrintCommandPrefix(mode=0){
      var prefix =  this.cmd.speed() +
                     this.cmd.darkness() +
                     this.cmd.leftMargin() +
                     this.cmd.rotate() +
                     this.cmd.rowOffset() +
                     this.cmd.labelDim() +
                     this.cmd.startPos() +
                     this.cmd.copies() +
                     (mode===0? this.cmd.startLabelNormal() : (mode===1? this.cmd.startLabelInverse() : this.cmd.startLabelMirror()));
      return prefix;
   }

   getPrintCommand(dpi){
      var cmd = this.getPrintCommandPrefix();
      for(var element of this.labelEle){
         cmd += element.getPrintCommand(dpi);
      }
      cmd += this.cmd.end();
      return cmd;
   }
}
