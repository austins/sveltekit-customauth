import type { Handle, HandleFetch } from "@sveltejs/kit";
import { deleteExpiredSessions, getSession } from "$lib/auth/session.server";
import { building } from "$app/environment";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcPathBase } from "$lib/trpc/config";
import { sequence } from "@sveltejs/kit/hooks";
import { appRouter } from "$lib/trpc/routers/appRouter.server";
import type { Context } from "$lib/trpc/context.server";

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
    request.headers.set("user-agent", event.request.headers.get("user-agent") ?? "");
    return fetch(request);
};

const sessionHandler: Handle = async ({ event, resolve }) => {
    if (!building) {
        await deleteExpiredSessions();

        event.locals.session = await getSession({
            clientIpAddress: event.getClientAddress(),
            request: event.request,
            cookies: event.cookies,
        });
    }

    return await resolve(event);
};

const trpcHandler: Handle = async ({ event, resolve }) => {
    // Check if this is a request to the tRPC endpoint.
    if (
        event.url.pathname.startsWith(`${trpcPathBase}/`) &&
        (event.request.method === "GET" || event.request.method === "POST")
    ) {
        return await fetchRequestHandler({
            endpoint: trpcPathBase,
            req: event.request,
            router: appRouter,
            createContext: (): Context => {
                return {
                    req: event.request,
                    session: event.locals.session,
                };
            },
        });
    }

    return await resolve(event);
};

export const handle: Handle = sequence(sessionHandler, trpcHandler);
