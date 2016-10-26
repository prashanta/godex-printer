/*jshint esversion: 6 */

import {Printer, SvgLabel} from '../src/index';

var p = new Printer({port: 'COM4'});

var svg = new SvgLabel(__dirname+'/L01.svg', {'PartNo':7188, 'uom': 'pcs', 'Qty': 122, 'Bin':'LX000'});
// /var svg = new SvgLabel(1, __dirname+'/L02.svg', {'partno':7188, 'uom': 'pcs', 'qty': 122, 'bin':'LX000', code: 'C00012'});
p.printLabel(svg);

p.on("printQueueEmpty", function(){
   console.log("Everything printed");
   p.stop();
});
