<script lang="ts">
    import TabNav from "$lib/components/TabNav.svelte";
    import PhListDashesBold from "~icons/ph/list-dashes-bold";
</script>

<div data-sveltekit-preload-data="off">
    <h1><PhListDashesBold class="inline-block" /> Admin</h1>

    <TabNav links={[{ url: "/admin", text: "Example" }]} />

    <slot />
</div>
