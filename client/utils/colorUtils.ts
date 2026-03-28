// Color utility functions for format conversion and validation

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

// Convert hex to RGB
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Convert hex to HSL
export const hexToHsl = (hex: string): HSL | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / diff + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (sNorm === 0) {
    r = g = b = lNorm; // achromatic
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1/3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1/3);
  }
  
  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
};

// Validate color format
export const isValidColor = (color: string): boolean => {
  // Check hex format
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return true;
  
  // Check RGB format
  if (/^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) return true;
  
  // Check RGBA format
  if (/^rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/i.test(color)) return true;
  
  // Check HSL format
  if (/^hsl\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(color)) return true;
  
  return false;
};

// Get color brightness (0-255)
export const getColorBrightness = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  // Using relative luminance formula
  return Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
};

// Determine if text should be light or dark based on background
export const getContrastColor = (backgroundColor: string): string => {
  const brightness = getColorBrightness(backgroundColor);
  return brightness > 128 ? '#000000' : '#ffffff';
};

// Generate color variations
export const generateColorVariations = (hex: string) => {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];
  
  const variations = [];
  
  // Lighter variations
  for (let i = 1; i <= 3; i++) {
    const lightness = Math.min(100, hsl.l + (i * 15));
    variations.push({
      name: `Light ${i}`,
      hex: hslToHex(hsl.h, hsl.s, lightness)
    });
  }
  
  // Darker variations
  for (let i = 1; i <= 3; i++) {
    const lightness = Math.max(0, hsl.l - (i * 15));
    variations.push({
      name: `Dark ${i}`,
      hex: hslToHex(hsl.h, hsl.s, lightness)
    });
  }
  
  return variations;
};

// Common color names to hex mapping (extended)
export const colorNames: Record<string, string> = {
  // Basic colors
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff',
  yellow: '#ffff00', cyan: '#00ffff', magenta: '#ff00ff', silver: '#c0c0c0', gray: '#808080',
  maroon: '#800000', olive: '#808000', lime: '#00ff00', aqua: '#00ffff', teal: '#008080',
  navy: '#000080', fuchsia: '#ff00ff', purple: '#800080', orange: '#ffa500', pink: '#ffc0cb',
  
  // Extended colors
  aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aquamarine: '#7fffd4', azure: '#f0ffff',
  beige: '#f5f5dc', bisque: '#ffe4c4', blanchedalmond: '#ffebcd', blueviolet: '#8a2be2',
  brown: '#a52a2a', burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
  chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc',
  crimson: '#dc143c', darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9', darkgreen: '#006400', darkkhaki: '#bdb76b', darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f', darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000',
  darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b', darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1', darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff',
  dimgray: '#696969', dodgerblue: '#1e90ff', firebrick: '#b22222', floralwhite: '#fffaf0',
  forestgreen: '#228b22', gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff', gold: '#ffd700',
  goldenrod: '#daa520', greenyellow: '#adff2f', honeydew: '#f0fff0', hotpink: '#ff69b4',
  indianred: '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
  lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00', lemonchiffon: '#fffacd',
  lightblue: '#add8e6', lightcoral: '#f08080', lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3', lightgreen: '#90ee90', lightpink: '#ffb6c1', lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa', lightskyblue: '#87cefa', lightslategray: '#778899', lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0', limegreen: '#32cd32', linen: '#faf0e6', mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd', mediumorchid: '#ba55d3', mediumpurple: '#9370db', mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee', mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585', midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5', navajowhite: '#ffdead', oldlace: '#fdf5e6', olivedrab: '#6b8e23',
  orangered: '#ff4500', orchid: '#da70d6', palegoldenrod: '#eee8aa', palegreen: '#98fb98',
  paleturquoise: '#afeeee', palevioletred: '#db7093', papayawhip: '#ffefd5', peachpuff: '#ffdab9',
  peru: '#cd853f', plum: '#dda0dd', powderblue: '#b0e0e6', rosybrown: '#bc8f8f',
  royalblue: '#4169e1', saddlebrown: '#8b4513', salmon: '#fa8072', sandybrown: '#f4a460',
  seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d', skyblue: '#87ceeb',
  slateblue: '#6a5acd', slategray: '#708090', snow: '#fffafa', springgreen: '#00ff7f',
  steelblue: '#4682b4', tan: '#d2b48c', thistle: '#d8bfd8', tomato: '#ff6347',
  turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3', whitesmoke: '#f5f5f5',
  yellowgreen: '#9acd32'
};