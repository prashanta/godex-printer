   /*jshint esversion: 6 */

import chai from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import Printer from './../src/printer';
import Label from './../src/label';
import Svg from './../src/svglabel';
import {Text, Rectangle, LineHor, LineVer, Barcode} from './../src/elements';

var expect = chai.expect;
var printer = new Printer();
var label = new Label();
var svg = new Svg(__dirname+'/../example/L01.svg', {'PartNo':9019921, 'uom': 'PCS', 'Qty': 19, 'Bin':'LX000'});

describe('GoDex Printer', function(){

   describe('Text Element', function(){
      it('Text.getPrintCommand for text font greater than 9 mm ', function(){
         var text = new Text('Hello world', 8, 8, 10);
         expect(text.getPrintCommand()).to.equal('AT,64,64,80,80,0,0,0,0,Hello world\n');
      });

      it('Text.getPrintCommand for text font less than 9 mm', function(){
         var text = new Text('Hello world', 8, 8, 8);
         expect(text.getPrintCommand()).to.equal('AH,64,64,1,1,1,0,Hello world\n');
      });
   });

   describe('Printer', function(){

      var spy = sinon.spy(printer, "nextPrintTask");

      it('printer.printLabel(label) should queue a valid print command', function(){
         label.addRect(0, 0, 73.5, 49, 0.5);
         label.addLineHor(0, 73.5, 24, 0.2);
         label.addLineVer(35, 24, 49, 0.2);
         label.addText("PART NUMBER", 2, 1, 2);
         label.addText("9019921", 2, 4, 6);
         label.addBarcode('CODE39', 2, 14, 0.2, 0.75, 8, "9019921");
         label.addText("QTY (PCS)", 2, 25, 2);
         label.addText("19", 2, 28, 6);
         label.addText("BIN", 36, 25, 2);
         label.addText("LX000", 36, 28, 6);
         printer.printLabel(label);

         expect(printer.queue[0]).to.equal(
            '^S4\n' +
            '^H6\n' +
            '~R150\n' +
            '^C1\n' +
            '^L\n' +
            '^W80\n' +
            '^Q52,2\n' +
            '^R26\n' +
            '~Q-15\n' +
            '^E20\n' +
            'R0,0,588,392,4,4\n' +
            'La,0,192,588,194\n' +
            'La,280,192,282,392\n' +
            'AB,16,8,1,1,1,0,PART NUMBER\n' +
            'AG,16,32,1,1,1,0,9019921\n' +
            'BA,16,112,2,6,64,0,0,9019921\n' +
            'AB,16,200,1,1,1,0,QTY (PCS)\n' +
            'AG,16,224,1,1,1,0,19\n' +
            'AB,288,200,1,1,1,0,BIN\n' +
            'AG,288,224,1,1,1,0,LX000\n' +
            'E\n'
         );
      });

      it('printer.printLabel(svgLabel) should queue a valid print command', function(){
         printer.printLabel(svg);
         expect(printer.queue[1]).to.equal(
            '^S4\n' +
            '^H6\n' +
            '~R150\n' +
            '^C1\n' +
            '^L\n' +
            '^W80\n' +
            '^Q52,2\n' +
            '^R26\n' +
            '~Q-15\n' +
            '^E20\n' +
            'R0,0,588,392,4,4\n' +
            'La,0,192,588,194\n' +
            'La,280,192,282,392\n' +
            'AB,16,8,1,1,1,0,PART NUMBER\n' +
            'AG,16,32,1,1,1,0,9019921\n' +
            'BA,16,112,2,6,64,0,0,9019921\n' +
            'AB,16,200,1,1,1,0,QTY (PCS)\n' +
            'AG,16,224,1,1,1,0,19\n' +
            'AB,288,200,1,1,1,0,BIN\n' +
            'AG,288,224,1,1,1,0,LX000\n' +
            'AB,440,344,1,1,1,0,'+moment().format('DD-MMM-YY')+'\n' +
            'E\n'
         );
      });

      it('printer.nextPrintTask was called twice', function(){
         sinon.assert.calledTwice(spy);
      });
   });
});
