import { useSettings } from './useSettings';

export const useTheme = () => {
  const { darkModeEnabled } = useSettings();
  
  return {
    isDarkMode: darkModeEnabled,
  };
};