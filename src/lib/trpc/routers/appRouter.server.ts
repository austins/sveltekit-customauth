import type { inferRouterError, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { Context } from "../context.server";
import { router } from "../trpc.server";
import { exampleRouter } from "./exampleRouter.server";

export const appRouter = router({
    example: exampleRouter,
});

export type AppRouter = typeof appRouter;

export function trpcSsr(context: Context) {
    return appRouter.createCaller(context);
}

export type AppRouterInputError = inferRouterError<AppRouter>["data"]["zodError"] | undefined;
export type AppRouterInputs = inferRouterInputs<AppRouter>;
export type AppRouterOutputs = inferRouterOutputs<AppRouter>;
