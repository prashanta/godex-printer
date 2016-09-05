/*jshint esversion: 6 */
/*
label.js
========
Contains methods that give GoDex EZPL commands for priting labels elements.
*/

export default class Label{
   constructor(opts){
      // Print speed
      this.speed = 2;
      // Print darkness
      this.darkness = 5;
      // Left margin
      this.leftMargin = 26;
      // Rotate printing
      this.rotate = 150;
      // Row Offset
      this.rowOffset = -25;
      // Label width =
      this.width = 80;
      // Label length
      this.length = 52;
      // Label gap
      this.gap = 2;
      // Stop position
      this.stopPos = 20;
      // Copies
      this.copies = 1;

      if(opts){
         this.speed = opts.speed || this.sleed;
         this.darkness = opts.darkness || this.darkness;
         this.leftMargin = opts.leftMargin || this.leftMargin;
         this.rotate = opts.rotate || this.rotate;
         this.rowOffset = opts.rowOffset || this.rowOffset;
         this.width = opts.width || this.width;
         this.length = opts.length || this.length;
         this.stopPos = opts.stopPos || this.stopPos;
         this.copies = opts.copies || this.copies;
      }

      this.cmd = {
         speed : ()=>{return `^S${this.speed}\n`;},
         darkness: ()=>{return `^H${this.darkness}\n`;},
         leftMargin: ()=>{return `^R${this.leftMargin}\n`;},
         rotate: ()=>{return `~R${this.rotate}\n`;},
         rowOffset: ()=>{return `~Q${this.rowOffset}\n`;},
         labelDim: ()=>{return `^W${this.width}\n^Q${this.length},${this.gap}\n`;},
         startPos: ()=>{return `^E${this.startPos}\n`;},
         copies: ()=>{return `^C${this.copies}\n`;},
         startLabelNormal: ()=>{return '^L\n';},
         startLabelInverse: ()=>{return '^LI\n';},
         startLabelMirror: ()=>{return '^LM\n';},
         startLabelRotate: (x)=>{return '^LR'+ x +'\n';},
      };

      this.set = {
         speed : x=>{this.speed = x;},
         darkness : x=>{this.darkness = x;},
         leftMargin : x=>{this.leftMargin = x;},
         width : x=>{ this.width = x;},
         length : x=>{this.length = x;},
         gap : x=>{this.gap = x;},
         copies: x=>{this.copies = x;}
      };
   }

   // Horizontal line commmand
   lineHor(x1,x2,y,t){
      var y1 = y,
          y2 = y+t;
      return `La,${x1},${y1},${x2},${y2}\n`;
   }

   // Vertical line commmand
   lineVer(x,y1,y2,t){
      var x1 = x,
          x2 = x+t;
      return `La,${x1},${y1},${x2},${y2}\n`;
   }

   // Rectangle command drawing
   rect(x1, y1, x2, y2, t){
      return `R${x1},${y1},${x2},${y2},${t},${t}\n`;
   }
}
