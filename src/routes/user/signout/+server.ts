import { deleteSession } from "$lib/auth/session.server";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, locals }) => {
    if (locals.session) {
        await deleteSession(cookies);
    }

    throw redirect(302, "/user/signin");
};
