import type { Session } from "$lib/auth/session.server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type Context = FetchCreateContextFnOptions & {
    session: Session | null;
};
