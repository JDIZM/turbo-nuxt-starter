import type { Meta, StoryObj } from "@storybook/vue3"
import { Spinner } from "ui"

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] }
  }
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: {
    size: "sm"
  }
}

export const Large: Story = {
  args: {
    size: "lg"
  }
}
