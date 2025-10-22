import type { Meta, StoryObj } from "@storybook/vue3"

const meta = {
  title: "Atoms/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Typography styles showcasing Poppins (sans) and Inter (serif) fonts"
      }
    }
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Headings: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <h1 class="text-5xl font-bold font-sans text-gray-900 dark:text-white">Heading 1 - Poppins Bold</h1>
        <h2 class="text-4xl font-bold font-sans text-gray-900 dark:text-white">Heading 2 - Poppins Bold</h2>
        <h3 class="text-3xl font-semibold font-sans text-gray-900 dark:text-white">Heading 3 - Poppins Semibold</h3>
        <h4 class="text-2xl font-semibold font-sans text-gray-900 dark:text-white">Heading 4 - Poppins Semibold</h4>
        <h5 class="text-xl font-medium font-sans text-gray-900 dark:text-white">Heading 5 - Poppins Medium</h5>
        <h6 class="text-lg font-medium font-sans text-gray-900 dark:text-white">Heading 6 - Poppins Medium</h6>
      </div>
    `
  })
}

export const BodyText: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-2xl">
        <p class="text-lg font-normal font-sans text-gray-800 dark:text-gray-200">
          Large body text using Poppins regular. The quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-base font-normal font-sans text-gray-800 dark:text-gray-200">
          Base body text using Poppins regular. The quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-sm font-normal font-sans text-gray-700 dark:text-gray-300">
          Small body text using Poppins regular. The quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-xs font-normal font-sans text-gray-600 dark:text-gray-400">
          Extra small body text using Poppins regular. The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    `
  })
}

export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="space-y-3">
        <p class="text-xl font-light font-sans text-gray-900 dark:text-white">Light (300) - Poppins</p>
        <p class="text-xl font-normal font-sans text-gray-900 dark:text-white">Regular (400) - Poppins</p>
        <p class="text-xl font-medium font-sans text-gray-900 dark:text-white">Medium (500) - Poppins</p>
        <p class="text-xl font-semibold font-sans text-gray-900 dark:text-white">Semibold (600) - Poppins</p>
        <p class="text-xl font-bold font-sans text-gray-900 dark:text-white">Bold (700) - Poppins</p>
        <p class="text-xl font-extrabold font-sans text-gray-900 dark:text-white">Extrabold (800) - Poppins</p>
        <p class="text-xl font-black font-sans text-gray-900 dark:text-white">Black (900) - Poppins</p>
      </div>
    `
  })
}

export const InterSerifFont: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-2xl">
        <h2 class="text-3xl font-bold font-serif text-gray-900 dark:text-white">Inter Serif Heading Bold</h2>
        <p class="text-lg font-normal font-serif leading-relaxed text-gray-800 dark:text-gray-200">
          Inter serif font for body text provides excellent readability. This paragraph demonstrates
          how Inter works as a secondary font choice. The quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-base font-medium font-serif text-gray-800 dark:text-gray-200">
          Medium weight Inter serif text for emphasis.
        </p>
      </div>
    `
  })
}

export const ColoredText: Story = {
  render: () => ({
    template: `
      <div class="space-y-3">
        <h3 class="text-2xl font-bold text-primary-600 font-sans">Primary Blue Text</h3>
        <h3 class="text-2xl font-bold text-secondary-600 font-sans">Secondary Slate Text</h3>
        <h3 class="text-2xl font-bold text-gray-900 font-sans">Gray 900 Text</h3>
        <h3 class="text-2xl font-bold text-red-600 font-sans">Red 600 Text</h3>
        <h3 class="text-2xl font-bold text-green-600 font-sans">Green 600 Text</h3>
      </div>
    `
  })
}

export const TextAlignment: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 w-full">
        <p class="text-xl font-semibold text-left font-sans">Left aligned text</p>
        <p class="text-xl font-semibold text-center font-sans">Center aligned text</p>
        <p class="text-xl font-semibold text-right font-sans">Right aligned text</p>
        <p class="text-xl font-semibold text-justify font-sans max-w-xl">
          Justified text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    `
  })
}

export const DisplayText: Story = {
  render: () => ({
    template: `
      <div class="space-y-6">
        <h1 class="text-6xl font-black font-sans tracking-tight text-gray-900 dark:text-white">
          Display XL - Black
        </h1>
        <h2 class="text-5xl font-bold font-sans tracking-tight text-gray-900 dark:text-white">
          Display Large - Bold
        </h2>
        <h3 class="text-4xl font-bold font-sans text-gray-900 dark:text-white">
          Display Medium - Bold
        </h3>
        <p class="text-3xl font-semibold font-sans text-primary-600 dark:text-primary-400">
          Display Small - Semibold Primary
        </p>
      </div>
    `
  })
}
