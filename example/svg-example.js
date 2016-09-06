/*jshint esversion: 6 */

import {Printer, SvgLabel} from '../src/index';

var p = new Printer({port: 'COM3'});
p.start();
var svg = new SvgLabel(__dirname+'/L01.svg', {'PartNo':7188, 'uom': 'pcs', 'Qty': 122});
svg.set.copies(2);
p.addPrintTask(svg.getPrintCommand());
p.stop();
