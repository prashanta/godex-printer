/*jshint esversion: 6 */

import {Printer, Label, SvgLabel} from '../src/index';
import LineHor from '../src/elements/LineHor';
import Promise from 'bluebird';

var p = new Printer();

p.getPortsSync()
.then(function(result){
   if(result.length > 0){
      console.log("Connecting to port  : " + result[0]);
      p.setPort(result[0]);
      return p.start();
   }
   else {
      return Promise.reject("No ports available");
   }
})
.then(function(){

   var label1 = new Label();
   label1.addRect(0,0,73.5,49,0.1);
   label1.addLineHor(0, 73.5, 24, 0.2);
   label1.addLineVer(35, 24, 49, 0.2);
   label1.addText("Part Number", 2, 1, 2);
   label1.addText("LREM2019", 1, 4, 10);
   label1.addBarcode('CODE39', 2, 14, 0.2, 0.75, 8, "7dds18891");
   label1.addText("QTY (PCS)", 2, 25, 2);
   label1.addText("19", 2, 28, 6);
   label1.addText("BIN", 36, 25, 2);
   label1.addText("Tray", 36, 28, 6);

   p.printLabel(label1);

   var label2 = new Label();
   label2.addText('Hello Label',5,10,9);
   p.printLabel(label2);

   p.on("printQueueEmpty", function(){
      console.log("Everything printed");
      p.stop();
   });
})
.catch(function(error){
   console.log(error);
});
