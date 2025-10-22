import type { Meta, StoryObj } from "@storybook/vue3"
import { Card } from "ui"

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"]
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <h3 class="text-lg font-semibold mb-2">Card Title</h3>
        <p class="text-gray-600">This is a card component with some content inside.</p>
      </Card>
    `
  })
}

export const LargePadding: Story = {
  args: {
    padding: "lg"
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <h3 class="text-lg font-semibold mb-2">Large Padding Card</h3>
        <p class="text-gray-600">This card has large padding (p-8) applied.</p>
      </Card>
    `
  })
}

export const SmallPadding: Story = {
  args: {
    padding: "sm"
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <h3 class="text-lg font-semibold mb-2">Small Padding Card</h3>
        <p class="text-gray-600">This card has small padding (p-4) applied.</p>
      </Card>
    `
  })
}

export const NoPadding: Story = {
  args: {
    padding: "none"
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">No Padding Card</h3>
          <p class="text-gray-600">This card has no default padding. Content is manually padded.</p>
        </div>
      </Card>
    `
  })
}
