import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  // format: ["cjs", "esm"],
  minify: process.env.NODE_ENV === "production",
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
});
