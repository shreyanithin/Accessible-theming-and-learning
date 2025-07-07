declare module 'color-blind' {
    const cb: {
      protanopia: (hex: string) => string;
      deuteranopia: (hex: string) => string;
      tritanopia: (hex: string) => string;
      achromatopsia: (hex: string) => string;
      [key: string]: (hex: string) => string;
    };
    export = cb;
  }
  