/*jshint esversion: 6 */
/*
label.js
========
Contains methods that give GoDex EZPL commands for priting labels elements.
*/
import _ from 'underscore';

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
      this.labelCmd = '';
   }

   addLabelCmd(command){
      if(command)
         this.labelCmd += command;
   }

   getPrintCommand(mode = 0){
      var prefix =  this.cmd.speed() +
                     this.cmd.darkness() +
                     this.cmd.leftMargin() +
                     this.cmd.rotate() +
                     this.cmd.rowOffset() +
                     this.cmd.labelDim() +
                     this.cmd.startPos() +
                     this.cmd.copies() +
                     (mode===0? this.cmd.startLabelNormal() : (mode===1? this.cmd.startLabelInverse() : this.cmd.startLabelMirror()));
      return prefix + this.labelCmd + this.cmd.end();
   }
   // Horizontal line commmand
   lineHor(xStart,xEnd,y,t){
      var yStart = y, yEnd = y+t;
      return `La,${xStart},${yStart},${xEnd},${yEnd}\n`;
   }
   addLineHor(xStart,xEnd,y,t){
      this.labelCmd += this.lineHor(xStart,xEnd,y,t);
   }

   // Vertical line commmand
   lineVer(x,yStart,yEnd,t){
      var xStart = x, xEnd = x+t;
      return `La,${xStart},${yStart},${xEnd},${yEnd}\n`;
   }
   addLineVer(x,yStart,yEnd,t){
      this.labelCmd += this.lineVer(x,yStart,yEnd,t);
   }

   // Rectangle command drawing
   rect(xStart, yStart, width, height, t){
      return `R${xStart},${yStart},${xStart+width},${yStart+height},${t},${t}\n`;
   }
   addRect(xStart, yStart, xEnd, yEnd, t){
      this.labelCmd += this.rect(xStart, yStart, xEnd, yEnd,t);
   }

   // Text command
   text(text, x, y, s){
      var i = [6, 8, 10, 12, 14, 18, 24, 30];
      var j = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      var k = _.map(i, function(num){ return Math.abs(num - s); });
      var l = _.lastIndexOf(k, _.min(k));
      return "A" + j[l] + "," + x + "," + y + ",1,1,1,0,"+ text + "\n";
   }

   addText(text, x, y, s, style=0){
      this.labelCmd += this.text(text, x, y, s, style=0);
   }

   barcode(type, x, y, narrow, width, height, rotation, readable, data){
      var barType = {'CODE39': 'A', 'EAN8': 'B', 'EAN13':'E', 'UPCA':'H', 'UPCE':'K', 'CODE93':'P', 'CODE128':'Q'};
      return `B${barType[type]},${x},${y},${narrow},${width},${height},${rotation},${readable},${data}\n`;
   }

   addBarcode(type, x, y, narrow, width, height, rotation, readable, data){
      this.labelCmd += this.barcode(type, x, y, narrow, width, height, rotation, readable, data);
   }
}
