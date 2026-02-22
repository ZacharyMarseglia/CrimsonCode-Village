import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [scheme, setScheme] = useState<'light' | 'dark'>();
  const [loadedScheme, setLoadedScheme] = useState(false);

  if (!loadedScheme) {
    setLoadedScheme(true);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Use the user's light/dark mode preference on load
    if (darkModeQuery.matches) {
      setScheme(darkModeQuery.matches ? 'dark' : 'light');
    }

    // Add a listener to update automatically when the light/dark mode changes
    darkModeQuery.addEventListener('change', (e) => {
      setScheme(e.matches ? 'dark' : 'light');
    });
  }

  return scheme;
}
