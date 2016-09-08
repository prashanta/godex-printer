/*jshint esversion: 6 */
/*
Element.js
========
Base class for all label elements
*/
import _ from 'underscore';

export default class Element{

   constructor(){
   }

   toDot(val, dpi){
      return Math.ceil(val * (dpi/25.4));
   }

   getPrintCommand(){
   }
}
