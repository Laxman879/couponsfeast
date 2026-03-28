'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Popover, 
  Grid, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Palette, ContentCopy, Refresh } from '@mui/icons-material';
import { hexToRgb, hexToHsl, generateColorVariations, colorNames, getContrastColor } from '@/utils/colorUtils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  helperText?: string;
}

// Tailwind color palette
const tailwindColors = {
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
    500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a'
  },
  gray: {
    50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
    500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827'
  },
  zinc: {
    50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa',
    500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b'
  },
  red: {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
    500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d'
  },
  orange: {
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
    500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12'
  },
  amber: {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
    500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f'
  },
  yellow: {
    50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15',
    500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12'
  },
  lime: {
    50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635',
    500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#365314', 900: '#1a2e05'
  },
  green: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
    500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
  },
  emerald: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
    500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b'
  },
  teal: {
    50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
    500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a'
  },
  cyan: {
    50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
    500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63'
  },
  sky: {
    50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
    500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e'
  },
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
    500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
  },
  indigo: {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
    500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81'
  },
  violet: {
    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
    500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95'
  },
  purple: {
    50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
    500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87'
  },
  fuchsia: {
    50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9',
    500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75'
  },
  pink: {
    50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
    500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843'
  },
  rose: {
    50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
    500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337'
  }
};

// Common color names to hex mapping
const colorNames = {
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

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, helperText }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [inputFormat, setInputFormat] = useState('hex');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [colorVariations, setColorVariations] = useState<Array<{name: string, hex: string}>>([]);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setInputValue(value);
    setColorVariations(generateColorVariations(value));
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const parseColor = (input: string): string | null => {
    const trimmed = input.trim().toLowerCase();
    
    // Check if it's a color name
    if (colorNames[trimmed as keyof typeof colorNames]) {
      return colorNames[trimmed as keyof typeof colorNames];
    }
    
    // Check if it's a hex color
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
      return trimmed;
    }
    
    // Check if it's RGB format
    const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      const rHex = parseInt(r).toString(16).padStart(2, '0');
      const gHex = parseInt(g).toString(16).padStart(2, '0');
      const bHex = parseInt(b).toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}`;
    }
    
    // Check if it's RGBA format
    const rgbaMatch = trimmed.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)$/);
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch;
      const rHex = parseInt(r).toString(16).padStart(2, '0');
      const gHex = parseInt(g).toString(16).padStart(2, '0');
      const bHex = parseInt(b).toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}`;
    }
    
    // Check if it's HSL format
    const hslMatch = trimmed.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      // Convert HSL to hex (simplified)
      return `#${parseInt(h).toString(16).padStart(2, '0')}${parseInt(s).toString(16).padStart(2, '0')}${parseInt(l).toString(16).padStart(2, '0')}`;
    }
    
    return null;
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setError('');
    
    const parsedColor = parseColor(newValue);
    if (parsedColor) {
      onChange(parsedColor);
    } else if (newValue.trim()) {
      setError('Invalid color format');
    }
  };

  const handleTailwindColorSelect = (color: string) => {
    setInputValue(color);
    onChange(color);
    setError('');
    setColorVariations(generateColorVariations(color));
    handleClose();
  };

  const handleVariationSelect = (color: string) => {
    setInputValue(color);
    onChange(color);
    setError('');
    handleClose();
  };

  const currentRgb = hexToRgb(value);
  const currentHsl = hexToHsl(value);
  const currentColorName = Object.entries(colorNames).find(([, hex]) => hex.toLowerCase() === value.toLowerCase())?.[0];
  const contrastColor = getContrastColor(value);

  const formatColor = (format: string) => {
    switch (format) {
      case 'rgb':
        return currentRgb ? `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})` : value;
      case 'hsl':
        return currentHsl ? `hsl(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%)` : value;
      case 'name':
        return currentColorName || value;
      default:
        return value;
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      {/* Color Preview and Input */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button
          onClick={handleClick}
          sx={{
            minWidth: 60,
            height: 40,
            backgroundColor: value,
            border: '2px solid #ddd',
            '&:hover': {
              backgroundColor: value,
              opacity: 0.8
            }
          }}
        >
          <Palette sx={{ color: value === '#ffffff' ? '#000' : '#fff' }} />
        </Button>
        
        <TextField
          fullWidth
          size="small"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter color name, hex, or RGB"
          error={!!error}
          helperText={error || helperText}
        />
      </Box>

      {/* Format Selection and Copy */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={inputFormat}
            label="Format"
            onChange={(e) => {
              setInputFormat(e.target.value);
              setInputValue(formatColor(e.target.value));
            }}
          >
            <MenuItem value="hex">HEX</MenuItem>
            <MenuItem value="rgb">RGB</MenuItem>
            <MenuItem value="hsl">HSL</MenuItem>
            <MenuItem value="name">Color Name</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          size="small"
          startIcon={<ContentCopy />}
          onClick={() => copyToClipboard(formatColor(inputFormat))}
        >
          Copy
        </Button>
        
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={() => setColorVariations(generateColorVariations(value))}
        >
          Variations
        </Button>
      </Box>

      {/* Current Color Info */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        <Chip 
          label={`HEX: ${value}`} 
          size="small" 
          onClick={() => copyToClipboard(value)}
          sx={{ cursor: 'pointer' }}
        />
        {currentRgb && (
          <Chip 
            label={`RGB: ${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}`} 
            size="small" 
            onClick={() => copyToClipboard(`rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`)}
            sx={{ cursor: 'pointer' }}
          />
        )}
        {currentHsl && (
          <Chip 
            label={`HSL: ${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%`} 
            size="small" 
            onClick={() => copyToClipboard(`hsl(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%)`)}
            sx={{ cursor: 'pointer' }}
          />
        )}
        {currentColorName && (
          <Chip 
            label={`Name: ${currentColorName}`} 
            size="small" 
            onClick={() => copyToClipboard(currentColorName)}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>

      {/* Enhanced Color Picker Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: 650, maxHeight: 600, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Tailwind Colors" />
            <Tab label="Color Variations" />
            <Tab label="Custom" />
          </Tabs>
          
          <Box sx={{ p: 2, maxHeight: 500, overflow: 'auto' }}>
            {/* Tailwind Colors Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tailwind Color Palette
                </Typography>
                
                {Object.entries(tailwindColors).map(([colorName, shades]) => (
                  <Box key={colorName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {colorName}
                    </Typography>
                    <Grid container spacing={0.5}>
                      {Object.entries(shades).map(([shade, hex]) => (
                        <Grid item key={shade}>
                          <Button
                            onClick={() => handleTailwindColorSelect(hex)}
                            sx={{
                              minWidth: 45,
                              height: 45,
                              backgroundColor: hex,
                              border: value === hex ? '3px solid #000' : '1px solid #ddd',
                              borderRadius: 1,
                              position: 'relative',
                              '&:hover': {
                                backgroundColor: hex,
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                                zIndex: 1
                              }
                            }}
                            title={`${colorName}-${shade}: ${hex}`}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getContrastColor(hex),
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}
                            >
                              {shade}
                            </Typography>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Color Variations Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Color Variations
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Based on current color: {value}
                </Typography>
                
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {colorVariations.map((variation, index) => (
                    <Grid item key={index}>
                      <Button
                        onClick={() => handleVariationSelect(variation.hex)}
                        sx={{
                          minWidth: 80,
                          height: 60,
                          backgroundColor: variation.hex,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          flexDirection: 'column',
                          '&:hover': {
                            backgroundColor: variation.hex,
                            opacity: 0.8,
                            transform: 'scale(1.05)'
                          }
                        }}
                        title={`${variation.name}: ${variation.hex}`}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: getContrastColor(variation.hex),
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}
                        >
                          {variation.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: getContrastColor(variation.hex),
                            fontSize: '8px'
                          }}
                        >
                          {variation.hex}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Custom Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Custom Color Input
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Enter colors in any format: color names (red, blue), HEX (#ff0000), RGB (rgb(255,0,0)), or HSL (hsl(0,100%,50%))
                </Alert>
                
                <TextField
                  fullWidth
                  label="Enter Color"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g., red, #ff0000, rgb(255,0,0), hsl(0,100%,50%)"
                  error={!!error}
                  helperText={error || 'Try: red, #ff0000, rgb(255,0,0), hsl(0,100%,50%)'}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime', 'indigo'].map((colorName) => (
                    <Chip
                      key={colorName}
                      label={colorName}
                      onClick={() => handleInputChange(colorName)}
                      sx={{ 
                        backgroundColor: colorNames[colorName],
                        color: getContrastColor(colorNames[colorName]),
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;