/*jshint esversion: 6 */

import chai from 'chai';
import Printer from './../src/printer';
import Label from './../src/label';

var expect = chai.expect;
var printer = new Printer();
var label = new Label();
describe('GoDex Printer', function(){

   describe("Label commands", function(){
      it('label.cmd.speed should return ^S2\n', function(){
         expect(label.cmd.speed()).to.equal('^S2\n');
      });

      it('label.cmd.copies should return ^C2\n', function(){
         label.set.copies(2);
         expect(label.cmd.copies()).to.equal('^C2\n');
      });

      it('label.getPrintCommand should return a valid print command', function(){
         label.set.darkness(5);
         label.set.leftMargin(26);
         label.set.rotate(150);
         label.set.rowOffset(-25);
         label.set.width(80);
         label.set.length(52);
         label.set.gap(2);
         label.set.startPos(20);
         label.set.copies(1);
         expect(label.getPrintCommand()).to.equal(
            '^S2\n' +  // Speed setting
            '^H5\n' +  // Print darkness setting
            '^R26\n'+  // Set left margin
            '~R150\n'+  // Rotate printing
            '~Q-25\n'+   // (in dots) Row Offset Adjustment. +n move the start position downward, and the –n move the position upward
            '^W80\n'+   // Set label width
            '^Q52,2\n' +
            '^E20\n' +   // Feed paper to a specific position after printing (in mm).
            '^C1\n' +
            '^L\n' +
            'E\n'
         );
      });



      it('label.cmd.labelDim should return ^W180\n^Q50,4\n', function(){
         label.set.width(180);
         label.set.length(50);
         label.set.gap(4);
         expect(label.cmd.labelDim()).to.equal('^W180\n^Q50,4\n');
      });

      it('label.lineHor(1,30,10,2) should return : La,1,10,30,12 \n', function(){
         expect(label.lineHor(1,30,10,2)).to.equal('La,1,10,30,12\n');
      });

      it('label.lineVer(10,1,30,2) should return : La,10,1,12,30 \n', function(){
         expect(label.lineVer(10,1,30,2)).to.equal('La,10,1,12,30\n');
      });

      it('label.rect(10,10,20,20,2) should return : R10,10,30,30,2,2 \n', function(){
         expect(label.rect(10,10,20,20,2)).to.equal('R10,10,30,30,2,2\n');
      });

   });

});
