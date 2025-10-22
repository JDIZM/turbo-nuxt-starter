import type { Meta, StoryObj } from "@storybook/vue3"
import { Badge } from "ui"

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger", "info"]
    }
  }
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Default</Badge>'
  })
}

export const Primary: Story = {
  args: {
    variant: "primary"
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Primary</Badge>'
  })
}

export const Success: Story = {
  args: {
    variant: "success"
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Success</Badge>'
  })
}

export const Warning: Story = {
  args: {
    variant: "warning"
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Warning</Badge>'
  })
}

export const Danger: Story = {
  args: {
    variant: "danger"
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Danger</Badge>'
  })
}
