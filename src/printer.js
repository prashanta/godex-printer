/*jshint esversion: 6 */
/*
printer.js
==========
A module to control GoDex printer.
*/
import SerialPort from 'serialport';
import events     from 'events';

var eventEmitter = new events.EventEmitter();

export default class Printer{

   //config : {port: 'COM2', baud: '9600'}
   constructor({port= null} = {}){
      this.port = port;
      this.baud = 9600;
      // Printer status
      this.status = { '00': 'Ready', '01': 'Media Empty or Media Jam', '02': 'Media Empty or Media Jam', '03': 'Ribbon Empty',
                      '04': 'Door Open', '05': 'Rewinder Full', '06': 'File System Full', '07': 'Filename Not Found',
                      '08': 'Duplicate Name', '09': 'Syntax Error', '10': 'Cutter Jam', '11': 'Extended Memory Not Found', '20': 'Pause', '21': 'In Setting Mode', '22': 'In Keyboard Mode', '50': 'Printer is Printing', '60': 'Data in Process' };

      this.isPrinting = false;
      this.queue = [];
      this.sp = null;
   }

   // Set serial port
   setPort(port){
      this.port = port;
   }

   start(){
      this.sp = new SerialPort(this.port, { baudrate: this.baud, parser: SerialPort.parsers.readline('\n')}, function(err){
         if(err)
            console.error(err);
         else{
            this.nextPrintTask();
         }
      }.bind(this));
   }

   stop(){
      if(this.sp && this.sp.isOpen())
         this.sp.close();
   }

   // Get list of serial ports
   getPorts(callback){
      var portList = [];
      SerialPort.list(function (err, ports) {
         if(ports.length > 0)
            portList = ports;
         callback(portList);
      });
   }

   // Push a print task to queue
   addPrintTask(task){
      this.queue.push(task);
      this.nextPrintTask();
   }

   // Run next task
   nextPrintTask(){
      if(this.sp && this.sp.isOpen()){
         // If not printing
         if(!this.isPrinting){
            // If task leftover in queue
            if(this.queue.length > 0){
               this.print(this.queue.splice(0,1)[0], function(err, message){
                  if(err)
                     console.error(message);
               }.bind(this));
            }
         }
      }
   }

   // Test print
   testPrint(callback){
      this.print('~V\n', callback);
   }

   // Test printer head
   testPrintHead(callback){
      this.print('~T\n', callback);
   }

   // Get printer status
   getPrinterStatus(callback){
      var sp = new SerialPort(this.port, {baudrate: 9600, parser: SerialPort.parsers.readline('\n')}, function(err){
         if(err){
            callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else{
            // On serial data received
            sp.on('data', function (data) {
               var d = data.replace('\r', '');
               callback(this.status [d]);
               sp.close();
            }.bind(this));
            // Write to serial
            sp.write("^XSET,IMMEDIATE,1\n~S,CHECK\n", function(err, results){
            });
         }
      }.bind(this));
   }

   print(command, callback){
      if(this.sp.isOpen()){
         if(!this.isPrinting){
            this.isPrinting = true;
            this.sp.write(command, function(){
               this.sp.drain(function(){
                  this.isPrinting = false;
                  this.nextPrintTask();
                  callback();
               }.bind(this));
            }.bind(this));
         }
      }
      else{
         callback(-1, "No port open");
      }
   }
}
