import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.VITE_BASE ?? (repoName ? `/${repoName}/` : "/");

// https://vite.dev/config/
export default defineConfig({
  base,
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [vue()],
});
