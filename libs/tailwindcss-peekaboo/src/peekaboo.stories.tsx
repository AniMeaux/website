// At least one import of react is necessary to fix the runtime error:
// ```
// Uncaught SyntaxError: The requested module '/@fs/Users/simonrelet/repo/animeaux/website/node_modules/.pnpm/react@18.3.1/node_modules/react/index.js?v=b1ac76c3' does not provide an export named 'default' (at chunk-DDIRQRCA.js?v=b1ac76c3:2:8)
// ```
// It looks like vite doesn't bumdle react the same way if it's not imported in
// the story file.
// import "react"

import { cn } from "@animeaux/core"
import { Primitive } from "@animeaux/react-primitives"
import { Presence } from "@radix-ui/react-presence"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { forwardRef } from "react"

import { DecoratorFrame } from "#i/storybook/decorators.js"

const AnimationDuration = {
  fast: cn("animation-duration-fast"),
  normal: cn("animation-duration-normal"),
  slow: cn("animation-duration-slow"),
}

type AnimationDuration = keyof typeof AnimationDuration

const meta = {
  title: "All animations",
  component: Peekaboo,
  parameters: { layout: "centered" },

  argTypes: {
    isOpened: {
      control: "boolean",
    },

    duration: {
      control: "select",
      options: Object.keys(AnimationDuration),
    },
  },

  args: {
    isOpened: true,
    duration: "normal",
  },
} satisfies Meta<typeof Peekaboo>

export default meta

type Story = StoryObj<typeof meta>

export const fade: Story = {
  name: "Fade",

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="out-opacity-0 data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const left: Story = {
  name: "Left",
  decorators: [DecoratorFrame],

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="absolute top-1/2 left-20 -translate-y-1/2 -out-translate-x-[calc(100%+var(--spacing)*20)] data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const right: Story = {
  name: "Right",
  decorators: [DecoratorFrame],

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="absolute top-1/2 right-20 -translate-y-1/2 out-translate-x-[calc(100%+var(--spacing)*20)] data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const top: Story = {
  name: "Top",
  decorators: [DecoratorFrame],

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="absolute top-20 left-1/2 -translate-x-1/2 -out-translate-y-[calc(100%+var(--spacing)*20)] data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const bottom: Story = {
  name: "Bottom",
  decorators: [DecoratorFrame],

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="absolute bottom-20 left-1/2 -translate-x-1/2 out-translate-y-[calc(100%+var(--spacing)*20)] data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const bottomFade: Story = {
  name: "Bottom Fade",

  render: (props) => (
    <Peekaboo {...props} asChild>
      <Component className="out-opacity-0 out-translate-y-40 data-closed:animate-exit data-opened:animate-enter">
        Lorem ipsum dolor
      </Component>
    </Peekaboo>
  ),
}

export const height: Story = {
  name: "Height",

  render: (props) => (
    <Peekaboo
      {...props}
      className="in-height-[200px] in-overflow-hidden out-height-0 data-closed:animate-exit data-opened:animate-enter"
    >
      <Component className="h-200">Lorem ipsum dolor</Component>
    </Peekaboo>
  ),
}

function Peekaboo({ isOpened, duration, className, ...props }: Peekaboo.Props) {
  return (
    <Presence present={isOpened}>
      <Primitive.div
        {...props}
        data-state={isOpened ? "open" : "closed"}
        className={cn(AnimationDuration[duration], className)}
      />
    </Presence>
  )
}

namespace Peekaboo {
  export interface Props extends React.ComponentPropsWithoutRef<
    typeof Primitive.div
  > {
    isOpened: boolean
    duration: AnimationDuration
  }
}

const Component = forwardRef<Component.Ref, Component.Props>(function Component(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("rounded-sm bg-gray-200 p-10", className)}
    />
  )
})

namespace Component {
  export type Ref = React.ComponentRef<"div">
  export type Props = React.ComponentPropsWithoutRef<"div">
}
