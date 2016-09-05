/*jshint esversion: 6 */

import chai from 'chai';
import Printer from './../src/printer';
import Label from './../src/label';

var expect = chai.expect;
var printer = new Printer();
var label = new Label();
describe('GoDex Printer', function(){

   describe("Label commands", function(){
      it('label.cmd.speed should return ^S5\n', function(){
         label.set.speed(5);
         expect(label.cmd.speed()).to.equal('^S5\n');
      });

      it('label.cmd.copies should return ^C2\n', function(){
         label.set.copies(2);
         expect(label.cmd.copies()).to.equal('^C2\n');
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

      it('label.rect(10,10,30,30,2) should return : R10,10,30,30,2,2 \n', function(){
         expect(label.rect(10,10,30,30,2)).to.equal('R10,10,30,30,2,2\n');
      });

   });

});
