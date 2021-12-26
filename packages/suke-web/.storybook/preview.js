import "../src/index.css";

// This package doesn't support running on StoryBook 6 at the moment.
import "@storybook/addon-console";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}