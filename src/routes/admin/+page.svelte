<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h2>Example</h2>

<p class="mb-4">Welcome to the admin page! This means you're logged in!</p>

<h3>Result from tRPC</h3>

<p>{data.example}</p>
