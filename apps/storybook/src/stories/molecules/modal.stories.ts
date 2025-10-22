import type { Meta, StoryObj } from "@storybook/vue3"
import { Modal, Button } from "ui"
import { ref } from "vue"

const meta = {
  title: "Molecules/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] }
  }
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Modal, Button },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <div>
        <Button @click="isOpen = true">Open Modal</Button>
        <Modal v-bind="args" :open="isOpen" @close="isOpen = false">
          <template #title>Modal Title</template>
          <p class="text-gray-600">This is the modal content. You can put anything here.</p>
          <template #footer>
            <Button @click="isOpen = false">Close</Button>
          </template>
        </Modal>
      </div>
    `
  })
}

export const Large: Story = {
  args: {
    size: "lg"
  },
  render: (args) => ({
    components: { Modal, Button },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <div>
        <Button @click="isOpen = true">Open Large Modal</Button>
        <Modal v-bind="args" :open="isOpen" @close="isOpen = false">
          <template #title>Large Modal</template>
          <p class="text-gray-600">This is a larger modal with more space for content.</p>
        </Modal>
      </div>
    `
  })
}
