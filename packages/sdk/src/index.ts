// Re-export all generated endpoints and types
export * from "./health";
export * from "./mutator";
export * from "./myAPI.schemas";
export * from "./prometheus";
export * from "./urls";

// Service objects for cleaner API (urls.create() instead of import { create })
import * as healthFns from "./health";
import * as prometheusFns from "./prometheus";
import * as urlsFns from "./urls";

export const urls = urlsFns;
export const health = healthFns;
export const prometheus = prometheusFns;
