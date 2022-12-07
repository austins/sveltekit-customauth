<script lang="ts">
    import { page } from "$app/stores";

    export let links: { url: string; text: string }[];
</script>

<div>
    <nav class="mb-3 flex border-b-2">
        {#each links as link (link.url)}
            {@const isActive = $page.url.pathname === link.url}
            <a
                href={link.url}
                class="border-r border-slate-300 px-4 py-2 last:border-r-0"
                class:text-black={isActive}
                class:border-b-2={isActive}
                class:border-b-slate-500={isActive}
                class:mb-[-2px]={isActive}
            >
                {link.text}
            </a>
        {/each}
    </nav>
</div>
