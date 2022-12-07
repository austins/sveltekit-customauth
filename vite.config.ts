import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import Icons from "unplugin-icons/vite";

const port = 3000;

const config: UserConfig = {
    plugins: [sveltekit(), Icons({ compiler: "svelte" })],
    server: { port },
    preview: { port },
    resolve: {
        alias: {
            ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
        },
    },
};

export default config;
