/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string, colorName?: keyof typeof Colors.light & keyof typeof Colors.dark },
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (props.colorName) {
    return Colors[theme][props.colorName];
  } else {
    return "#ff0000"; // Red for warning of missing color
  }
}
