import "./styles.css"

import type { Preview } from "@storybook/react-vite"

declare module "@storybook/react" {
  // This interface is not strongly typed.
  // https://storybook.js.org/docs/api/parameters#available-parameters
  interface Parameters {
    layout?: "centered" | "fullscreen" | "padded"
  }
}

const preview: Preview = {}

export default preview
