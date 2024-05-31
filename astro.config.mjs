import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { youtubeDirective } from './src/lib/markdown/youtube.ts';
import { cfProjectBanner } from "./src/lib/markdown/cf_project_banner.ts";
import { cfProjectEmbed } from "./src/lib/markdown/cf_project_embed.ts";
import tailwind from "@astrojs/tailwind";
const gameVersion = '1.20.1';

export default defineConfig({
  site: 'https://docs.darkhax.net/mc/1.20.1',
  integrations: [starlight({
    title: `Mod Docs | ${gameVersion}`,
    logo: {
      light: './src/assets/logo_light.svg',
      dark: './src/assets/logo_dark.svg'
    },
    description: `The official home for documentation on Darkhax's ${gameVersion} mods.`,
    social: {
      discord: 'https://discord.darkhax.net',
      github: `https://github.com/Darkhax/docs.darkhax.net/tree/${gameVersion}`
    },
    editLink: {
      baseUrl: 'https://github.com/withastro/starlight/edit/main/docs/',
    },
    pagination: false,
    customCss: [
        "./src/styles/tailwind.css",
        "./src/styles/custom.css"
    ]
  }), tailwind()],
  markdown: {
    remarkPlugins: [youtubeDirective(), cfProjectBanner(), cfProjectEmbed()]
  }
});