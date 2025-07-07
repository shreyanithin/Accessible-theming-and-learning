
# access-utils

A lightweight utility package for color accessibility tools using `chroma-js` and `color-blind`.  
This library helps developers ensure their applications are inclusive and readable by simulating color blindness, validating color contrast ratios, and offering accessible color suggestions.

---

##  Features

-  Validate hex color formats
-  Convert between HEX, RGB, and HSL
-  Calculate contrast ratios between two colors
-  Suggest more accessible color variants
-  Simulate how colors appear to people with color blindness

---

##  Installation

```bash
npm install access-utils
```

---

##  Usage

###  Import

```ts
import {
  getContrastRatio,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isValidHex,
  findAccessibleColor,
  simulateColorBlindness
} from 'access-utils';
```

---

###  Contrast Ratio

```ts
getContrastRatio('#ffffff', '#000000'); 
// returns 21
```

---

###  Validate HEX

```ts
isValidHex('#abc123'); // true
isValidHex('red');     // false
```

---

###  Convert HEX ↔ RGB

```ts
hexToRgb('#3498db');        // { r: 52, g: 152, b: 219 }
rgbToHex(52, 152, 219);     // '#3498db'
```

---

###  Convert RGB ↔ HSL

```ts
rgbToHsl(255, 0, 0);        // [0, 100, 50]
hslToRgb(0, 100, 50);       // { r: 255, g: 0, b: 0 }
```

---

###  Suggest More Accessible Color

```ts
findAccessibleColor('#a3c1ad', '#ffffff'); 
// returns a color with better contrast
```

---

###  Color Blindness Simulation

```ts
simulateColorBlindness('#ff0000');

/*
{
  protanopia: '#6e6e00',
  deuteranopia: '#6e6e00',
  tritanopia: '#ff0000'
}
*/
```

---

##  Built With

- [`chroma-js`](https://github.com/gka/chroma.js) – for color conversions and contrast calculations  
- [`color-blind`](https://www.npmjs.com/package/color-blind) – to simulate vision deficiencies  
- `TypeScript` – for static type checking and development
