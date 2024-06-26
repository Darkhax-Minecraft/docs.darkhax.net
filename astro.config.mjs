import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections';
import {youtubeDirective} from './src/lib/markdown/youtube.ts';
import {cfProjectBanner} from "./src/lib/markdown/cf_project_banner.ts";
import {cfProjectEmbed} from "./src/lib/markdown/cf_project_embed.ts";
import {betterLink} from "./src/lib/markdown/links.ts";
import tailwind from "@astrojs/tailwind";
import {env} from "node:process"

const outDir = env.outDir || "./dist/"
const isProd = import.meta.env.PROD;

const headEntries = [];

if (isProd) {
    headEntries.push({
        tag: 'script',
        attrs: {
            async: true,
            defer: true,
            'data-website-id': 'b3e2d6de-b61e-49bf-8ca1-e74e6ea2413b',
            src: 'https://nlytics.blmj.red/scrpt'
        }
    })
}

headEntries.push({
    tag: 'script',
    attrs: {
        async: true,
        defer: true,
        src: 'https://docs.darkhax.net/assets/easter/hedgehog.js'
    }
})

export default defineConfig({
    site: `https://docs.darkhax.net`,
    outDir: `${outDir}root`,
    integrations: [starlight({
        title: `Mod Docs`,
        head: headEntries,
        logo: {
            light: './src/assets/logo_light.svg',
            dark: './src/assets/logo_dark.svg'
        },
        description: `The official home for documentation on Darkhax's mods.`,
        social: {
            discord: 'https://discord.darkhax.net',
            github: `https://github.com/Darkhax-Minecraft`
        },
        editLink: {
            baseUrl: `https://github.com/Darkhax-Minecraft/docs.darkhax.net/edit/main/`
        },
        pagination: false,
        customCss: [
            "./src/styles/tailwind.css",
            "./src/styles/custom.css",
            "./src/fonts/font-face.css"
        ],
        expressiveCode: {
            plugins: [pluginCollapsibleSections()]
        },
        lastUpdated: true,
        components: {
            Footer: './src/components/CustomFooter.astro',
        }
    }), tailwind()],
    markdown: {
        remarkPlugins: [youtubeDirective(), cfProjectBanner(), cfProjectEmbed(), betterLink()]
    }
});