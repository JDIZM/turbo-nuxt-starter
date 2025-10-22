import type { Meta, StoryObj } from "@storybook/vue3"
import { Input } from "ui"

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"]
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    fullWidth: { control: "boolean" }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text..."
  }
}

export const WithLabel: Story = {
  args: {
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com"
  }
}

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    error: "Password must be at least 8 characters",
    modelValue: "short"
  }
}

export const WithHelperText: Story = {
  args: {
    label: "Username",
    helperText: "Choose a unique username",
    placeholder: "johndoe"
  }
}

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    disabled: true,
    modelValue: "Cannot edit this"
  }
}

export const Required: Story = {
  args: {
    label: "Required Field",
    required: true,
    placeholder: "This field is required"
  }
}

export const FullWidth: Story = {
  args: {
    label: "Full Width Input",
    fullWidth: true,
    placeholder: "Takes up full width"
  }
}

export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Small input"
  }
}

export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "Large input"
  }
}
