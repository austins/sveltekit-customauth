<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/layout/header/Header.svelte";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import type { LayoutData } from "./$types";
    import { page } from "$app/stores";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    export let data: LayoutData;

    // Show a loading indicator when navigating to other pages.
    let loading = false;

    beforeNavigate(({ type, to }) => {
        if (to?.route.id === null) {
            // External link.
            return;
        }

        if (type !== "unload") {
            loading = true;
        }
    });

    afterNavigate(({ type }) => {
        if (type !== "unload") {
            loading = false;
        }
    });

    $: title = $page.data.title ?? null;
</script>

<svelte:head>
    <title>{title ? `${title} | ` : ""}SvelteKit Custom Auth</title>
</svelte:head>

<div class="flex h-screen flex-col" data-sveltekit-preload-data="tap">
    <Header session={data.session} currentPath={$page.url.pathname} />

    <main class="container grow leading-relaxed">
        {#if loading}
            <LoadingSpinner />
        {:else}
            <slot />
        {/if}
    </main>
</div>
