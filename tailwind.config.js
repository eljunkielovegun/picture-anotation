// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html,css}'],
  theme: {
    extend: {
      fontFamily: {
        'p22': ['P22Freely', 'serif'],
        'urwdin': ['urw-din', 'sans-serif'],
        'felttip': ['felt-tip-roman', 'cursive'],
      },
      fontSize: {
        'giant': '5rem',
      },
      colors: {
        'gallery-orange': '#CE9579',
        'gallery-purple': '#9B86A3',
        'gallery-blue': '#8EC1BF',
        'gallery-green': '#2C3925',
        'gallery-beige': '#BFB6A3',
        'gallery-black': '#231F20',
        'gallery-altBlack': '#1A1A1A',
        'gallery-offWhite': '#F5F7DC',
        'gallery-desertOrange': '#D16141',
        'gallery-deepPurple': '#5F3833',
      },
    },
  },
  safelist: [
    'font-p22',
    'font-urwdin',
    'font-felttip',
    'text-giant',
    'text-gallery-orange',
    'text-gallery-purple',
    'text-gallery-green',
    'text-gallery-beige',
    'text-gallery-black',
    'text-gallery-deepPurple',
    'bg-gallery-offWhite',
    'bg-gallery-green',
    'border-gallery-beige',
  ],
  plugins: [],
};
