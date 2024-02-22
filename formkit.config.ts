import { DefaultConfigOptions } from "@formkit/vue";
import "@formkit/themes/genesis";
import { createAutoAnimatePlugin } from "@formkit/addons";

// Only needed until beta.5 is out:
if (typeof global !== "undefined") {
  (global as Record<string, any>).File = function () {};
}

const config: DefaultConfigOptions = {
  plugins: [createAutoAnimatePlugin()],
};

export default config;
