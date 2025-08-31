// packages/sdk/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    entry: "src/index.ts",
  },
  clean: true,
  sourcemap: true,
  outDir: "dist",
  target: "es2020",
  splitting: false,
  treeshake: true,
  external: ["undici", "@notionhq/client", "googleapis"],
  noExternal: [],
});
