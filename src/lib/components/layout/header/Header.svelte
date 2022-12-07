<script lang="ts">
    import type { Session } from "$lib/auth/session.server";
    import NavLink from "./NavLink.svelte";

    export let session: Session | null;
    export let currentPath: string;

    $: isAdminPath = currentPath === "/admin" || currentPath.startsWith("/admin/");
</script>

<header class="border-b border-slate-200 bg-gradient-to-b from-slate-100 via-slate-50 to-white">
    <div class="container flex items-center">
        <h1 class="mb-0 text-3xl font-normal">
            <a href="/" class="text-black hover:text-black hover:no-underline">SvelteKit Custom Auth</a>
        </h1>

        <nav class="ml-3 flex grow">
            <NavLink url="/">Home</NavLink>
        </nav>

        {#if session}
            <nav class="flex" data-sveltekit-preload-data="off">
                {#if isAdminPath}
                    <NavLink url="/">Back to Site</NavLink>
                {:else}
                    <NavLink url="/admin">Admin</NavLink>
                {/if}

                <NavLink url="/user/signout">Sign Out</NavLink>
            </nav>
        {:else}
            <nav class="flex">
                <NavLink url="/user/signin">Sign In</NavLink>
            </nav>
        {/if}
    </div>
</header>
