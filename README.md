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

var printer = new Printer({port:'COM2'}); // Create a new printer
printer.start(); // Start printer, does serial port initialization

var label1 = new Label({width: 80, height: 50}); // Create a new label.
label1.addText("Label-1", 10, 10, 20); // Add text to label
label3.addRect(5, 5, 500, 150, 2); // Add rectangle
label1.addBarcode('CODE39', 5, 100, 2, 4, 50, 0 ,1, "718891"); // Add CODE39 barcode

printer.addPrintTask(label1.getPrintCommand()); // Add print task
p.stop(); // Stop printer
```

___Note:___ All units are in dots (dot as in dpi. For 203 dpi printer 1mm = 8 dots)

---

#### __Label template in SVG__

```javascript
import {Printer, SvgLabel} from '../src/index';

var printer = new Printer({port: 'COM2'});
printer.start();

var svgLabel = new SvgLabel(__dirname+'/L01.svg', {'PartNo':7188, 'uom': 'pcs', 'Qty': 122});
svgLabel.set.copies(2);
printer.addPrintTask(svgLabel.getPrintCommand());
printer.stop();
```

SVG template file contains:

```svg
<svg width="80mm" height="52mm" style="border: 1px solid #CCC" data-template-name="test">

   <!-- Rectangle -->
   <rect x="0mm" y="0mm" width="79mm" height="48.5mm" style="stroke: #000000; fill: none;" stroke-width="0.3mm" />

   <!-- Line -->
   <line x1="0mm" y1="25mm" x2="74mm" y2="25mm" stroke="red" stroke-width="0.25mm" fill="none" />

   <!-- Texts with place holders -->
   <text x="1mm" y="3.5mm" font-size= "2mm">Part Number</text>
   <text x="1mm" y="10mm" font-size= "6mm">{PartNo}</text>
   <text x="1mm" y="30mm" font-size= "2mm">QTY ({uom})</text>
   <text x="1mm" y="36mm" font-size= "4mm">{Qty}</text>

   <!-- Barcode -->
   <text x="1mm" y="22mm" font-size= "8mm" data-barcode-type='CODE39'>#BA#-PartNo</text>

   <!-- Current date stamp -->
   <text x="55mm" y="45mm" font-size= "1mm">#DATE#</text>
</svg>
```

___Note:___ All units in SVG must be in mm (For 203 dpi printer 1mm = 8 dots)

---

#### __Label Properties__

| Property  | Description | Default Value |
| ------- | ---------------- | ---------------- |
| speed | Print speed | 2 |
| darkness | Print ink darkness | 5 |
| leftMargin | Margin to leave from left of lable | 5 |
| roate | Label rotation | 150 |
| rowOffset | Margin to leave from top of label | -25 |
| width | Width of label | 80 (in mm) |
| length | Length of label | 52 (in mm) |
| Gap | Gap between labels | 2 (in mm) |
| startPos | Label feed position after printing | 20 |
| copies | Number of copies of a label to print | 1 |

---

### __License__

MIT
