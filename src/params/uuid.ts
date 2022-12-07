import type { ParamMatcher } from "@sveltejs/kit";
import { version as uuidVersion, validate as validateUuid } from "uuid";

export const match: ParamMatcher = (param) => {
    return validateUuid(param) && uuidVersion(param) === 4;
};
