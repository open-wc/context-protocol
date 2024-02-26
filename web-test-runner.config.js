import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  browsers: [
    playwrightLauncher({
      launchOptions: {
        headless: false,
        devtools: true
      },
    }),
  ],
}
