import type { CombinedDataTransformer } from "@trpc/server";
import superjson from "superjson";
import { stringify as devalueStringify, parse as devalueParse } from "devalue";

export const transformer: CombinedDataTransformer = {
    input: superjson,
    output: {
        serialize: (object) => {
            return devalueStringify(object);
        },
        deserialize: (object) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return devalueParse(object as string);
        },
    },
};
