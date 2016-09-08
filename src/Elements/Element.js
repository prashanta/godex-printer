/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';

export default class Element{

   constructor(){
      this.dpi = 203;
   }

   toDot(val){
      return Math.ceil(val * (this.dpi/25.4));
   }

   getPrintCommand(dpi){
      this.dpi = dpi;
   }
}
