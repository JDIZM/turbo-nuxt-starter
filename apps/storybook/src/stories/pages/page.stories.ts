import type { Meta, StoryObj } from "@storybook/vue3"
import { Page as MyPage } from "ui"

const meta = {
  title: "Pages/Page",
  component: MyPage,
  render: (args) => ({
    components: { MyPage },
    setup() {
      return { args }
    },
    template: '<my-page v-bind="args" />'
  }),
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof MyPage>

export default meta
type Story = StoryObj<typeof meta>

export const TurborepoDemo: Story = {
  args: {
    appName: "Storybook"
  }
}
