// Re-export all generated endpoints
export * from "./health";
export * from "./mutator";
export * from "./myAPI.schemas";
export * from "./prometheus";
export * from "./urls";

// Service objects for cleaner API
import * as healthFns from "./health";
import * as prometheusFns from "./prometheus";
import * as urlsFns from "./urls";

export const health = healthFns;
export const prometheus = prometheusFns;
export const urls = urlsFns;
