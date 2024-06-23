import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			black: {
				700: '#222222',
				800: '#181818',
				900: '#111111'
			},
			grey: {
				600: '#BCBCBC',
				900: '#777777'
			},
			red: '#BF3737',
			green: '#22D234'
		},
		fontFamily: {
			sans: ['Poppins', 'sans-serif']
		}
	},
	plugins: []
} as Config;
