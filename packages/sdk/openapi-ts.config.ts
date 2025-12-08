import { defineConfig } from "@hey-api/openapi-ts";

const CONTROLLER_REGEX = /^[a-z]+Controller/;

const formatName = (raw: string) => {
  const cleaned = raw.replace(CONTROLLER_REGEX, "");
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
};

export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: {
    format: "biome",
    path: "src/client",
  },
  plugins: [
    {
      name: "@hey-api/typescript",
      exportFromIndex: true,
      requests: {
        name: (name) => `${formatName(name)}Data`,
      },
      responses: {
        name: (name) => formatName(name),
        response: (name) => `${formatName(name)}Response`,
      },
    },
    {
      name: "@hey-api/client-fetch",
      exportFromIndex: true,
    },
    {
      asClass: true,
      name: "@hey-api/sdk",
      exportFromIndex: true,
      classNameBuilder: (name) =>
        `${name.charAt(0).toLowerCase()}${name.slice(1)}`,
      methodNameBuilder: (operation) => {
        const cleaned = operation.id.replace(CONTROLLER_REGEX, "");
        return `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
      },
    },
  ],
});
