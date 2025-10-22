import type { Meta, StoryObj } from "@storybook/vue3"
import { Alert } from "ui"

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["success", "info", "warning", "error"] },
    dismissible: { control: "boolean" }
  }
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success!",
    message: "Your action was completed successfully."
  }
}

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    message: "Here's some important information for you."
  }
}

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    message: "Please review this warning message carefully."
  }
}

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    message: "An error occurred. Please try again."
  }
}

export const Dismissible: Story = {
  args: {
    variant: "info",
    title: "Dismissible Alert",
    message: "Click the X button to dismiss this alert.",
    dismissible: true
  }
}
