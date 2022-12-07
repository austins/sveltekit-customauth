import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import type { Context } from "./context.server";
import { transformer } from "./transformer";

const trpc = initTRPC.context<Context>().create({
    transformer,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" && error.cause instanceof ZodError
                        ? error.cause.flatten().fieldErrors
                        : null,
            },
        };
    },
});

export const router = trpc.router;
export const middleware = trpc.middleware;

export const procedure = trpc.procedure;

export const authedProcedure = procedure.use(
    middleware(({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return next();
    })
);
