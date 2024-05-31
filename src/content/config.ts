import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const gameVersion = '1.20.4'
export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
};