import { light, dark } from '@eva-design/eva';

// Custom light theme with pink primary color (#DC3760)
export const customLightTheme = {
  ...light,
  'color-primary-100': '#FFE5ED',
  'color-primary-200': '#FFCCDB',
  'color-primary-300': '#FFB3CA',
  'color-primary-400': '#FF99B8',
  'color-primary-500': '#DC3760', // Main pink color
  'color-primary-600': '#C02F54',
  'color-primary-700': '#A42748',
  'color-primary-800': '#881F3C',
  'color-primary-900': '#6C1730',
  
  'color-success-500': '#00D68F',
  'color-info-500': '#0095FF',
  'color-warning-500': '#FFAA00',
  'color-danger-500': '#FF3D71',
  
  'text-basic-color': '#2E3A59',
  'text-hint-color': '#8F9BB3',
  'background-basic-color-1': '#FFFFFF',
  'background-basic-color-2': '#F7F9FC',
  'background-basic-color-3': '#EDF1F7',
};

// Custom dark theme with pink primary color (#DC3760)
export const customDarkTheme = {
  ...dark,
  'color-primary-100': '#6C1730',
  'color-primary-200': '#881F3C',
  'color-primary-300': '#A42748',
  'color-primary-400': '#C02F54',
  'color-primary-500': '#DC3760', // Main pink color
  'color-primary-600': '#FF99B8',
  'color-primary-700': '#FFB3CA',
  'color-primary-800': '#FFCCDB',
  'color-primary-900': '#FFE5ED',
  
  'color-success-500': '#00D68F',
  'color-info-500': '#0095FF',
  'color-warning-500': '#FFAA00',
  'color-danger-500': '#FF3D71',
  
  'text-basic-color': '#FFFFFF',
  'text-hint-color': '#8F9BB3',
  'background-basic-color-1': '#1A1A1A',
  'background-basic-color-2': '#2D2D2D',
  'background-basic-color-3': '#404040',
  'border-basic-color-1': '#404040',
  'border-basic-color-2': '#555555',
  'border-basic-color-3': '#666666',
};

// Mantener compatibilidad con el tema anterior
export const customTheme = customLightTheme;

export const customMapping = {};
