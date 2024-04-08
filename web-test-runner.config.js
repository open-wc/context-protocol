import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  files: ["test/**/*.test.{js,ts}"],
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  filterBrowserLogs(log) {
    return (
      log.args[0] !==
      "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information."
    );
  },
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  ],
  fullyParallel: true,
};
