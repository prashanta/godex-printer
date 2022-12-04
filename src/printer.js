/*jshint esversion: 6 */
/*
printer.js
==========
A module to control GoDex printer.
*/
import {SerialPort} from 'serialport';
import EventEmitter from 'events';
import Label from './label';
import Promise from 'bluebird';

/**
 * Class representing Printer
 * @extends EventEmitter
 */
export default class Printer extends EventEmitter{

   constructor({port= null,
               baud = 9600,
               dpi=203,
               speed= 4,
               darkness= 6,
               rotate= 150} = {}){
      super();

      // Serial port name
      this.port = port;

      // Serial port baud rate
      this.baud = baud;

      // Printer specific dot per inch
      this.dpi = dpi;

      this.config = {speed, darkness, rotate};

      this.cmd = {
         speed : ()=>{return `^S${this.config.speed}\n`;},
         darkness: ()=>{return `^H${this.config.darkness}\n`;},
         rotate: ()=>{return `~R${this.config.rotate}\n`;},
         end: ()=>{return 'E\n';}
      };

      this.set = {
         speed : x=>{this.config.speed = x;},
         darkness : x=>{this.config.darkness = x;},
         rotate : x=>{this.config.rotate = x;}
      };

      // Printer status
      this.status = { '00': 'Ready', '01': 'Media Empty or Media Jam', '02': 'Media Empty or Media Jam', '03': 'Ribbon Empty',
                      '04': 'Door Open', '05': 'Rewinder Full', '06': 'File System Full', '07': 'Filename Not Found',
                      '08': 'Duplicate Name', '09': 'Syntax Error', '10': 'Cutter Jam', '11': 'Extended Memory Not Found', '20': 'Pause', '21': 'In Setting Mode', '22': 'In Keyboard Mode', '50': 'Printer is Printing', '60': 'Data in Process' };

      this.isPrinting = false;
      this.queue = [];
      this.sp = null;

      // Try to connect to port
      if(this.port){
         this.start()
         .then(function(){
            this.nextPrintTask();
         }.bind(this))
         .catch(function(err){
            console.log(err.message);
         });
      }
   }

   // Set serial port
   setPort(port){
      this.port = port;
   }

   // Start serial port
   start(port){
      return new Promise(function(resolve, reject){
         this.port = port? port : this.port;
         if((this.sp === null || !this.sp.isOpen) && this.port){
            this.sp = new SerialPort({path: this.port, baudRate: this.baud}, function(err){
               if(err)
                  reject(err);
               else
                  resolve();
            }.bind(this));
         }
         else{
            reject("Cannot open port");
         }
      }.bind(this));
   }

   // Stop serial port
   stop(){
      if(this.sp && this.sp.isOpen)
         this.sp.close();
   }

   // Get list of serial ports
   getPorts(callback, raw){
      SerialPort.list(function (err, ports) {
         if(err){
            if(callback)
               callback(err, null);
         }
         else{
            if(!raw){
               var portNames = [];
               if(ports.length > 0)
                  ports.forEach(function(port){ portNames.push(port.comName); });
               callback(null, portNames);
            }
            else {
               callback(null, ports);
            }
         }
      });
   }

   // Get list of serial ports synchronously
   async getPortsSync(raw){
      var ports = await SerialPort.list();
      console.log(ports);
      if(!raw){
         var portNames = [];
         if(ports.length > 0)
            ports.forEach((port) => { portNames.push(port.path); });
         return portNames;
      }
      else{
         return ports;
      }
   }

   // DEPRECATED - Push a print task to queue
   addPrintTask(task){
      console.error("DEPRECATED: Printer.addPrintTask() depricated, use Printer.PrintLabel(Label) instead.");
   }

   // Push a print task to queue
   printLabel(label){
      if(label instanceof Label){
         var cmd = this.getPrintCommandPrefix() + label.getPrintCommandPrefix() + label.getPrintCommand(this.dpi) + this.cmd.end();
         this.queue.push(cmd);
         this.nextPrintTask();
      }
   }

   // Push a raw print command to queue
   printLabelRaw(command){
      this.queue.push(command);
      this.nextPrintTask();
   }

   // Test print
   testPrint(callback){
      this.print('~V\n', callback);
   }

   // Test printer head
   testPrintHead(callback){
      this.print('~T\n', callback);
   }

   // Calibrate printer
   calibrate(callback){
      this.print('~S,SENSOR\n', callback);
   }

   // Factory reset printer
   factoryReset(callback){
      this.print('^Z\n', callback);
   }

   // Get printer status
   getPrinterStatus(callback, flag){
      if(this.sp && this.sp.isOpen){
         // On serial data received
         this.sp.once('data', function(data){
            var d = data.replace('\r', '');
            if(callback)
               callback(null, this.status[d]);
         }.bind(this));
         // Write to serial
         this.sp.write("^XSET,IMMEDIATE,1\n~S,CHECK\n", function(err, results){
         });
      }
      else{
         if(callback)
            callback(new Error("Port not started!"), null);
      }
   }

   // Print next task in queue
   nextPrintTask(){
      // If serial port is open
      if(this.sp && this.sp.isOpen){
         // If not printing and task leftover in queue
         if(!this.isPrinting && this.queue.length > 0){
            var task = this.queue.splice(0,1)[0];
            this.print(task);
         }
         else{
            this.emit('printQueueEmpty');
         }
      }
   }

   // Print
   print(command, callback){
      // If serial port is open
      if(this.sp.isOpen){
         // If currently not printing
         if(!this.isPrinting){
            this.isPrinting = true;
            this.sp.write(command, function(){
               this.sp.drain(function(){
                  this.isPrinting = false;
                  this.nextPrintTask();
                  if(callback)
                     callback(null);
               }.bind(this));
            }.bind(this));
         }
      }
      else{
         if(callback)
            callback(new Error("Port not open"));
      }
   }

   getPrintCommandPrefix(mode=0){
      var prefix =  this.cmd.speed() +
                     this.cmd.darkness() +
                     this.cmd.rotate();
      return prefix;
   }
}
