/*jshint esversion: 6 */

import {Printer, Label, SvgLabel} from '../src/index';

var p = new Printer({port: 'COM3'});
p.start();


var label1 = new Label();
label1.addText("Howdy", 5, 5, 20);
label1.addBarcode('CODE39', 5, 100, 2, 4, 50, 0 ,1, "718891");
label1.addBarcode('EAN8', 5, 200, 2, 4, 80, 0 ,1, "97188913");

var label2 = new Label({leftMargin: 300});
label2.set.copies(1);
label2.addText("There", 10, 10, 20, 1);

var label3 = new Label();
label3.addRect(5, 5, 50, 50, 2);
label3.addText("Partner", 10, 10, 20, 1);

p.addPrintTask(label1.getPrintCommand());
p.addPrintTask(label2.getPrintCommand());
p.addPrintTask(label3.getPrintCommand());

p.stop();
