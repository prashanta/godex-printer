/*jshint esversion: 6 */

import Printer from '../src/printer';
import SvgLabel from '../src/svglabel';

var p = new Printer();
var svg = new SvgLabel(__dirname+'/L01.svg', {});
console.log(svg.getPrintCommand());


// p.addPrintTask("Task1");
// p.addPrintTask("Task5");
// p.addPrintTask("Task6");
//
// setTimeout(function(){
//    p.addPrintTask("Task2");
// }, 1000);
//
// setTimeout(function(){
//    p.addPrintTask("Task3");
// }, 2000);
//
// setTimeout(function(){
//    p.addPrintTask("Task4");
// }, 1000);
