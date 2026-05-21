import { Inter, Playfair_Display, Oswald, Outfit } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
export const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const fonts = {
    inter,
    outfit,
    playfair,
    oswald,
};

export const fontOptions = [
    { label: 'Sans Serif (Outfit)', value: 'var(--font-outfit)', className: outfit.className },
    { label: 'Sans Serif (Inter)', value: 'var(--font-inter)', className: inter.className },
    { label: 'Serif (Playfair)', value: 'var(--font-playfair)', className: playfair.className },
    { label: 'Headline (Oswald)', value: 'var(--font-oswald)', className: oswald.className },
];
