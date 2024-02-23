import { defaultConfig, createInput } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";
import { createAutoAnimatePlugin } from "@formkit/addons";

import InputWrapper from "@/components/forms/InputWrapper.vue";

function addAsteriskPlugin(node: any) {
  const legends: string[] = []; // Define the type of legends array

  if (
    ["button", "submit", "hidden", "group", "list", "meta"].includes(
      node.props.type
    )
  )
    return;

  node.on("created", () => {
    const legendOrLabel: string = legends.includes(
      `${node.props.type}${node.props.options ? "_multi" : ""}`
    )
      ? "legend"
      : "label";

    if (node.props.definition.schemaMemoKey) {
      node.props.definition.schemaMemoKey += `${
        node.props.options ? "_multi" : ""
      }_add_asterisk`;
    }

    const schemaFn: Function = node.props.definition.schema;
    node.props.definition.schema = (sectionsSchema: any = {}) => {
      sectionsSchema[legendOrLabel] = {
        children: [
          "$label",
          {
            $el: "span",
            if: "$state.required",
            attrs: {
              class: "$classes.asterisk",
            },
            children: ["*"],
          },
        ],
      };

      return schemaFn(sectionsSchema);
    };
  });
}

const config = defaultConfig({
  config: {
    rootClasses,
  },
  inputs: {
    text: createInput(InputWrapper, { props: ["icon", "label"] }),
  },
  plugins: [createAutoAnimatePlugin(), addAsteriskPlugin],
});

export default config;
