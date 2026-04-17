import type { Meta, StoryObj } from "@storybook/vue3"
import { fn } from "storybook/test"
import { Header } from "ui"

const meta = {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    logo: { control: "text" },
    showMobileMenu: { control: "boolean" },
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onToggleMobileMenu: fn(),
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    logo: "Turbo Nuxt",
    navigationItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "About", href: "/about", active: false },
    ],
    user: null,
  },
}

export const WithUser: Story = {
  args: {
    logo: "Turbo Nuxt",
    navigationItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "Projects", href: "/projects", active: false },
      { label: "Settings", href: "/settings", active: false },
    ],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  },
}

export const LoggedOut: Story = {
  args: {
    logo: "My App",
    navigationItems: [
      { label: "Home", href: "/", active: true },
      { label: "Features", href: "/features", active: false },
      { label: "Pricing", href: "/pricing", active: false },
    ],
    user: null,
  },
}

export const MinimalNav: Story = {
  args: {
    logo: "Simple",
    navigationItems: [{ label: "Home", href: "/", active: true }],
    user: null,
  },
}

export const LongNavigation: Story = {
  args: {
    logo: "Dashboard",
    navigationItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "Analytics", href: "/analytics", active: false },
      { label: "Reports", href: "/reports", active: false },
      { label: "Team", href: "/team", active: false },
      { label: "Settings", href: "/settings", active: false },
    ],
    user: {
      name: "Admin User",
      email: "admin@company.com",
    },
  },
}

export const NoMobileMenu: Story = {
  args: {
    logo: "Desktop Only",
    navigationItems: [
      { label: "Home", href: "/", active: true },
      { label: "About", href: "/about", active: false },
    ],
    user: null,
    showMobileMenu: false,
  },
}
