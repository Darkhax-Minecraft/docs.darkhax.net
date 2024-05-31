/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';
import tailwindAspectRatio from '@tailwindcss/aspect-ratio';
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				accent: colors.teal,
				gray: colors.zinc
			}
		},
	},
	plugins: [starlightPlugin(), tailwindAspectRatio],
}
