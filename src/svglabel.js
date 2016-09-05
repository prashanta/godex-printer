/*jshint esversion: 6 */

/*
svglabel.js
===========
A module to reade SVG and spit out EZPL command for GoDex printers.
*/
import Label from './label';
import fs from 'fs';
import parse from 'xml-parser';
import _ from 'underscore';
import moment from 'moment';

export default class SvgLabel extends Label{
   constructor(file, data, opts){
      var xml = fs.readFileSync(file, 'utf8');
      var temp = parse(xml);
      super({
         width: temp.root.attributes.width.replace("mm", ""),
         length: temp.root.attributes.height.replace("mm", "")
      });
      this.svg = temp;
      this.data = data;
      this.toDot = 8;
   }

   getPrintCommand(){
      var result = "";
      _.each(this.svg.root.children, function(child) {
         var att = child.attributes;
         var name = child.name;

         // remove unit - mm
         att = _.mapObject(att, function(val, key) {
            return val.replace("mm", "");
         });

         if(name == "line"){
            this.svgLine(att);
         }
         else if(name == "rect"){
            this.svgRect(att);
         }
         else if(name == "text"){
            // Barcode
            if(child.content.indexOf("#BA#") >= 0)
               result += this.svgBarCode(child.content, att, data);
            // Date
            else if(child.content.indexOf("#DATE#") >= 0){
               result += this.svgText(moment().format('DD-MMM-YY'), att, data);
            }
            // Normal Text
            else
               result += this.svgText(child.content, att, data);
         }
      }, this);
      return super.getPrintCommand() ;
   }

   /*
   * Convert SVG Line to EZPL Line
   */
   svgLine(att){
      if((att.x1 == att.x2) && (att.y1 != att.y2)){
         var x = att.x * this.toDot,
             yStart = att.y1*this.toDot,
             yEnd = att.y2*this.toDot,
             tv = att['stroke-width']*this.toDot;
         this.addLineVer(x, yStart, yEnd, tv);
      }
      else if((att.y1 == att.y2) && (att.x1 != att.x2)){
         var xStart = att.x1 * this.toDot,
             xEnd = att.x2*this.toDot,
             y = att.y1*this.toDot,
             th = att['stroke-width']*this.toDot;
         this.addLineHor(xStart, xEnd, y, th);
      }
      else
         return "";
   }

   svgRect(att){
      var xStart = att.x * this.toDot;
      var yStart = att.y * this.toDot;
      var width = att.width * this.toDot;
      var height = att.height * this.toDot;
      var t = Math.floor(att['stroke-width'] * this.toDot);
      this.addRect(xStart, yStart, width, height, t);
   }
}
