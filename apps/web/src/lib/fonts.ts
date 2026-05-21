import { Inter, Playfair_Display, Oswald } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
export const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const fonts = {
    inter,
    playfair,
    oswald,
};

export const fontOptions = [
    { label: 'Sans Serif (Inter)', value: 'var(--font-inter)', className: inter.className },
    { label: 'Serif (Playfair)', value: 'var(--font-playfair)', className: playfair.className },
    { label: 'Headline (Oswald)', value: 'var(--font-oswald)', className: oswald.className },
];
