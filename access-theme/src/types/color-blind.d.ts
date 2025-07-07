declare module 'color-blind' {
  type BlindType = 'protanopia' | 'deuteranopia' | 'tritanopia';

  const cb: Record<BlindType, (hex: string) => string>;

  export default cb;
}
