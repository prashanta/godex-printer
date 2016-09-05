/*jshint esversion: 6 */

import Printer from '../src/printer';
import Label from '../src/label';

var l = new Label();

var p = new Printer();
p.addPrintTask("Task1");
p.addPrintTask("Task5");
p.addPrintTask("Task6");

setTimeout(function(){
   p.addPrintTask("Task2");
}, 1000);

setTimeout(function(){
   p.addPrintTask("Task3");
}, 2000);

setTimeout(function(){
   p.addPrintTask("Task4");
}, 1000);
