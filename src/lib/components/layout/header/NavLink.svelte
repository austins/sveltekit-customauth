<script lang="ts">
    import { page } from "$app/stores";

    export let url = "#";
    export let activeStartsWith: string | null = null;

    export let onClick: (e: MouseEvent) => void = () => {
        return null;
    };

    export let withBorder = true;
</script>

<a
    href={url}
    class="inline-block px-4 py-2 no-underline hover:no-underline"
    class:border-slate-300={withBorder}
    class:border-r={withBorder}
    class:last:border-r-0={withBorder}
    class:text-black={activeStartsWith?.length
        ? $page.url.pathname.startsWith(activeStartsWith)
        : url === "#"
        ? false
        : $page.url.pathname === url}
    on:click={onClick}
>
    <slot />
</a>
