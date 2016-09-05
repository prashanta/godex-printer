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
   constructor(config){

      this.port = 'COM2';
      this.baud = 9600;
      if(config){
         // Serial port
         this.port = config.port || this.port;
         // Baud rate
         this.baud = config.baud || this.baud;
      }
      // Printer status
      this.status = { '00': 'Ready', '01': 'Media Empty or Media Jam', '02': 'Media Empty or Media Jam', '03': 'Ribbon Empty',
                      '04': 'Door Open', '05': 'Rewinder Full', '06': 'File System Full', '07': 'Filename Not Found',
                      '08': 'Duplicate Name', '09': 'Syntax Error', '10': 'Cutter Jam', '11': 'Extended Memory Not Found', '20': 'Pause', '21': 'In Setting Mode', '22': 'In Keyboard Mode', '50': 'Printer is Printing', '60': 'Data in Process' };

      this.isPrinting = false;
      this.queue = [];
   }

   // Set serial port
   setPort(port){
      this.port = port;
   }

   // Push a print task to queue
   addPrintTask(task){
      this.queue.push(task);
      this.nextTask();
   }

   // Run next task
   nextTask(){
      // If not printing
      if(!this.isPrinting){
         // If task leftover in queue
         if(this.queue.length > 0){
            this.print(this.queue.splice(0,1)[0], function(result){
               console.log(result);
            });
         }
      }
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
      var sp = new SerialPort(this.settings.port, {baudrate: 9600, parser: SerialPort.parsers.readline('\n')}, false);
      // Opern serial connection
      sp.open(function (error) {
         if(error){
            callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else {
            // On serial data received
            sp.on('data', function (data) {
               var d = data.replace('\r', '');
               callback(this.status[d]);
               sp.close();
            }.bind(this));
            // Write to serial
            sp.write("^XSET,IMMEDIATE,1\n~S,CHECK\n", function(err, results){
            });
         }
      }.bind(this));
   }

   print(command, callback){
      if(!this.isPrinting){
         this.isPrinting = true;
         var sp = new SerialPort(this.port, {baudrate: this.baud}, function(err){
            if(err){
               callback({error: -1, message: `Error opening port: ${this.port}. Check if printer is connected.`});
               this.isPrinting = false;
               this.nextTask();
            }
            else {
               sp.write(command, function(err, results){
                  sp.close();
                  callback("Printing done");
                  this.isPrinting = false;
                  this.nextTask();
               }.bind(this));
            }
         }.bind(this));
      }
   }
}
