# godex-printer

Sends EZPL print commands to GoDex label printer via serial port. Uses SVG as template for labels. For more information on GoDex's EZPL go [here](http://www.godexintl.com/EN/download/downloads/list/Manuals).

---

#### __Installation__

```bash
npm install godex-printer
```

---

#### __Quick Start__

```javascript
// Import necessary modules
import {Printer, Label} from 'godex-printer';

var printer = new Printer({port:'COM4'}); // Create a new printer

// All units are in mm
var label1 = new Label({width: 80, height: 52}); // Create a new label.
label1.addRect(0,0,73.5,49,0.1);
label1.addLineHor(0, 73.5, 24, 0.2);
label1.addLineVer(35, 24, 49, 0.2);
label1.addText("Part Number", 2, 1, 2);
label1.addText("LREM2019", 1, 4, 10);
label1.addBarcode('CODE39', 2, 14, 0.2, 0.75, 8, "7dds18891");
label1.addText("QTY (PCS)", 2, 25, 2);
label1.addText("19", 2, 28, 6);
label1.addText("BIN", 36, 25, 2);
label1.addText("Tray", 36, 28, 6);

// Deprecated -> printer.addPrintTask(label1.getPrintCommand());
printer.printLabel(label1);

printer.on("printQueueEmpty", function(){
   console.log("Everything printed");
   printer.stop();
});
```

___Note:___ All units are in dots (dot as in dpi. For 203 dpi printer 1mm = 8 dots)

---

#### __Label template in SVG__

```javascript
import {Printer, SvgLabel} from '../src/index';

var printer = new Printer();
printer.start('COM4')
.then(function(){
   var svgLabel = new SvgLabel(__dirname+'/L01.svg', {'PartNo':7188, 'uom': 'pcs', 'Qty': 122});
   // Deprecated -> printer.addPrintTask(svgLabel.getPrintCommand());
   printer.on("printQueueEmpty", function(){
      console.log("Everything printed");
      printer.stop();
   });
});


```

SVG template file contains:

```svg
<svg width="80mm" height="52mm" style="border: 1px solid #CCC" data-template-name="test" labelGap="2" leftMargin= "26" rowOffset= "-15" startPos= "20">
   <!-- Rectangle -->
   <rect x="0mm" y="0mm" width="73.5mm" height="49mm" style="stroke: #000000; fill: none;" stroke-width="0.5mm" />
   <!-- Line -->
   <line x1="0mm" y1="24mm" x2="73.5mm" y2="24mm" stroke="red" stroke-width="0.2mm" fill="none" />
   <!-- Line -->
   <line x1="35mm" y1="24mm" x2="35mm" y2="49mm" stroke="red" stroke-width="0.2mm" fill="none" />
   <text x="2mm" y="3mm" font-size= "2mm">PART NUMBER</text>
   <text x="2mm" y="10mm" font-size= "6mm">{PartNo}</text>
   <text x="2mm" y="22mm" font-size= "8mm" data-barcode-type='CODE39'>#BA#-PartNo</text>
   <text x="2mm" y="27mm" font-size= "2mm">QTY ({uom})</text>
   <text x="2mm" y="34mm" font-size= "6mm">{Qty}</text>
   <text x="36mm" y="27mm" font-size= "2mm">BIN</text>
   <text x="36mm" y="34mm" font-size= "6mm">{Bin}</text>
   <text x="55mm" y="45mm" font-size= "2mm">#DATE#</text>
</svg>
```

___Note:___ All units in SVG must be in mm (For 203 dpi printer 1mm = 8 dots). Exceptions are: _leftMargin_, _rowOffset_ and _startPos_ which are in dots.

---

#### __Label Properties__

| Property  | Description | Default Value |
| ------- | ---------------- | ---------------- |
| speed | Print speed | 4 |
| darkness | Print ink darkness | 26 |
| roate | Label rotation | 150 |
| leftMargin | Margin to leave from left of lable | 26 |
| rowOffset | Margin to leave from top of label | -15 |
| width | Width of label | 80 (in mm) |
| length | Length of label | 52 (in mm) |
| Gap | Gap between labels | 2 (in mm) |
| startPos | Label feed position after printing | 20 |
| copies | Number of copies of a label to print | 1 |

---

### __License__

MIT
