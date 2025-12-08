import { defineConfig } from "orval";

export default defineConfig({
  snapit: {
    input: "../../apps/api/openapi.json",
    output: {
      target: "./src",
      client: "fetch",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/mutator.ts",
          name: "customFetch",
        },
      },
    },
  },
});
