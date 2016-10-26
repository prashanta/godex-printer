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
   constructor(file, data, copies = 1){
      var xml = fs.readFileSync(file, 'utf8');
      var temp = parse(xml);
      super(
         copies,
         temp.root.attributes.width.replace("mm", ""),
         temp.root.attributes.height.replace("mm", ""),
         temp.root.attributes.labelGap.replace("mm", ""),
         temp.root.attributes.leftMargin.replace("mm", ""),
         temp.root.attributes.rowOffset.replace("mm", ""),
         temp.root.attributes.startPos.replace("mm", "")
      );
      this.svg = temp;
      this.data = data;
      this.toDot = 8;
   }

   getPrintCommand(){
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
               this.svgBarcode(child.content, att);
            // Date
            else if(child.content.indexOf("#DATE#") >= 0){
               this.svgText(moment().format('DD-MMM-YY'), att);
            }
            // Normal Text
            else
               this.svgText(child.content, att);
         }
      }, this);
      return super.getPrintCommand() ;
   }

   /*
   * Convert SVG Line to EZPL Line
   */
   svgLine(att){
      if((att.x1 == att.x2) && (att.y1 != att.y2)){
         var x = parseFloat(att.x1),
             yStart = parseFloat(att.y1),
             yEnd = parseFloat(att.y2),
             tv = parseFloat(att['stroke-width']);

         this.addLineVer(x, yStart, yEnd, tv);
      }
      else if((att.y1 == att.y2) && (att.x1 != att.x2)){
         var xStart = parseFloat(att.x1),
             xEnd = parseFloat(att.x2),
             y = parseFloat(att.y1),
             th = parseFloat(att['stroke-width']);
         this.addLineHor(xStart, xEnd, y, th);
      }
   }

   svgRect(att){
      var xStart = parseFloat(att.x);
      var yStart = parseFloat(att.y);
      var width = parseFloat(att.width);
      var height = parseFloat(att.height);
      var t = parseFloat(att['stroke-width']);
      this.addRect(xStart, yStart, width, height, t);
   }

   svgBarcode(content, att){
      var type = att['data-barcode-type'];
      var val = content;
      _.each(_.keys(this.data), function(key){
         val = val.replace("#BA#-"+ key, this.data[key]);
      }.bind(this));
      var x = parseFloat(att.x);
      var fs = parseFloat(att["font-size"]);
      var y = parseFloat(att.y) - fs ;
      this.addBarcode(type, x, y, 0.2, 0.75, fs, val);
   }

   svgText(content, att){
      var val = content;
      _.each(_.keys(this.data), function(key){
         val = val.replace("{"+ key +"}", this.data[key]);
      }.bind(this));
      var fs = parseFloat(att["font-size"]);
      var x = parseFloat(att.x);
      var y = parseFloat(att.y) - fs;
      this.addText(val, x, y, fs);
   }
}
