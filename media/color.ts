import { Color } from 'react-bootstrap/esm/types';

export type VariantColor = Exclude<Color, 'white' | 'muted'>;

export const VariantColors: VariantColor[] = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'dark',
    'light'
];

export function text2color(raw: string, excludeColors: VariantColor[] = []) {
    const colors = excludeColors[0]
            ? VariantColors.filter(
                  color => !excludeColors.find(c => c === color)
              )
            : VariantColors,
        sum = [...raw].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[sum % colors.length];
}
