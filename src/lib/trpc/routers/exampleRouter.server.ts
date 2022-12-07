import { authedProcedure, router } from "../trpc.server";

export const exampleRouter = router({
    hello: authedProcedure.query(() => {
        return "Hello, world, from tRPC!";
    }),
});
