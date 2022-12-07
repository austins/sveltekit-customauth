import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
    if (locals.session) {
        throw redirect(302, "/admin");
    }

    return { title: "Sign In" };
};
