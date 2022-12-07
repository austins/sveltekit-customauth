import { trpcClient } from "$lib/trpc/trpcClient";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ fetch }) => {
    return {
        example: trpcClient(fetch).example.hello.query(),
        title: "Admin",
    };
};
