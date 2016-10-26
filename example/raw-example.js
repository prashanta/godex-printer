/*jshint esversion: 6 */

import {Printer, Label, SvgLabel} from '../src/index';
import LineHor from '../src/elements/LineHor';

var p = new Printer();

p.on("printQueueEmpty", function(){
   console.log("Everything printed");
   p.stop();
});

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
   var line1 = new LineHor(5,25,25,0.5);
   var line2 = new LineHor(45,60,25,0.5);
   var cmd ='^S4\n' +
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
   'E\n';

   p.printLabelRaw(cmd);
})
.catch(function(error){
   console.log(error);
});









//p.start();
//p.stop();
