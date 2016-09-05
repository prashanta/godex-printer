/*jshint esversion: 6 */

/*
svg2ezpl.js
===========
A module to reade SVG and spit out EZPL command for GoDex printers.
*/
import fs from 'fs';
import parse from 'xml-parser';
import _ from 'underscore';
import moment from 'moment';

export function svg2ezpl(){

   this.toDot = 8;
   this.labelWidth = 70;
   this.labelHeight = 30;
   /*
   * Get print command for given data and template
   */
   this.getPrintCmd= function(data, template){
      // Read SVG file and parse into JSON
      var xml = fs.readFileSync('app/templates/' + template + '.svg', 'utf8');
      var obj = parse(xml);
      var result = "";
      _.each(obj.root.children, function(child) {
         var att = child.attributes;
         var name = child.name;

         // remove unit - mm
         att = _.mapObject(att, function(val, key) {
            return val.replace("mm", "");
         });

         if(name == "line"){
            result += this.getLine(att);
         }
         else if(name == "rect"){
            result += this.getRect(att);
         }
         else if(name == "text"){
            // Barcode
            if(child.content.indexOf("#BA#") >= 0)
               result += this.getBarCode(child.content, att, data);
            // Date
            else if(child.content.indexOf("#DATE#") >= 0){
               result += this.getText(moment().format('DD-MMM-YY'), att, data);
            }
            // Normal Text
            else
               result += this.getText(child.content, att, data);
         }
      }, this);
      return "^L\n" + result + "E\n" ;
   };

   /*
   * Convert SVG Line to EZPL Line
   */
   this.getLine = function(att){
      var x2, y2;
      if(att.x1 == att.x2){
         x2 = (1*att.x2) + (1*att['stroke-width']);
         y2 = att.y2;
      }

      else if(att.y1 == att.y2){
         x2 = att.x2;
         y2 = (1*att.y2) + (1*att['stroke-width']);
      }

      var line = "La," + (att.x1*this.toDot) + "," + (att.y1*this.toDot) + ","  + x2*this.toDot + "," + y2*this.toDot + "\n";
      return line;
   };

   /*
   * Convert SVG Rectangle to EZPL Rectangle
   */
   this.getRect = function(att){
      var x1 = att.x * this.toDot;
      var y1 = att.y * this.toDot;
      var x2 = ((att.x*1) + (att.width*1)) * this.toDot;
      var y2 = ((att.y*1) + (att.height*1)) * this.toDot;
      var w = Math.floor(att['stroke-width'] * this.toDot);
      var line = "R" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + w + "," + w + "\n";
      return line;
   };

   /*
   * Convert SVG Text to EZPL Text
   */
   this.getText = function(content, att, data){
      var line = "";
      var val = content;
      _.each(_.keys(data), function(key){
         val = val.replace("{"+ key +"}", data[key]);
      });
      var fs = att["font-size"]*1;
      var x = att.x * this.toDot;
      var y = ((att.y*1) - fs) * this.toDot;
      var w = att["font-size"]*this.toDot;
      var b = att["stroke"]? "0B" : "0";
      if(b == "0"){
         var i = [6, 8, 10, 12, 14, 18, 24, 30];
         var j = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
         fs = Math.floor(fs * 3.75);
         var k = _.map(i, function(num){ return fs>num?(fs-num):(num-fs); });
         var l = _.lastIndexOf(k, _.min(k));
         line = "A" + j[l] + "," + x + "," + y + ",1,1,1,0,"+ val + "\n";
      }
      else
      line = "AT," + x + "," + y + "," + w + "," + w  + ",1," + b + ",0,0," + val + "\n";
      return line;
   };

   // Convert SVG Text to EZPL  Barcode
   this.getBarCode = function(content, att, data){
      var val = content;
      _.each(_.keys(data), function(key){
         val = val.replace("#BA#-"+ key, data[key]);
      });
      var line = "BA,";
      var x = att.x * this.toDot;
      var fs = att["font-size"]*1;
      var y = ((att.y*1) - fs) * this.toDot;

      line = line + x + "," + y + ",2,4,"+fs*this.toDot+",0,0," + val + "\n";
      return line;
   };
}
