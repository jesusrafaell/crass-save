/** @type {import('tailwindcss').Config} */
export default {
	content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
	theme: {
		letterSpacing: {
			tightest: '-.075em',
			tighter: '-.05em',
			tight: '-.025em',
			normal: '0',
			wide: '.025em',
			wider: '.05em',
			widest: '.1em',
			widestx: '.25em',
		},
	},
	screens: {
		sm: '640px',
		md: '768px',
		lg: '960px',
		xl: '1200px',
	},
	extend: {
		colors: {
			base: '#E902AF',
		},
	},
	plugins: [],
};
