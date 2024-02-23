import { defaultConfig, createInput } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";
import { createAutoAnimatePlugin } from "@formkit/addons";

import InputWrapper from "@/components/forms/InputWrapper.vue";

export default defaultConfig({
  locale: "es",
  config: {
    rootClasses,
  },
  inputs: {
    text: createInput(InputWrapper, { props: ["icon", "label"] }),
  },
  plugins: [createAutoAnimatePlugin()],
});
