## godex-printer.js
Sends EZPL print commands to GoDex printer via serail port. Uses SVG as template for labels.
Still work in progress!
---

### Install

```
npm install godex-printer
```

### Usage

#### Basic
```
import {Printer, Label} from 'godex-printer'

var p = new Printer({port: 'COM2'});
var label = new Label();
label.addRect(0, 0, 200, 200, 2); // unit in dots
label.addText("Howdy!", 10, 10, 12, 12);
p.print(label.getPrintCommand());
```
