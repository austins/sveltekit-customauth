import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const { session } = await event.parent();
    if (!session) {
        throw redirect(302, "/user/signin");
    }

    return {};
};
