import type { Meta, StoryObj } from "@storybook/vue3"
import { Footer } from "ui"

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  tags: ["autodocs"],
  argTypes: {
    copyright: { control: "text" }
  }
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Documentation", href: "/docs" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "#blog" },
          { label: "Careers", href: "#careers" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Help Center", href: "#help" },
          { label: "API Reference", href: "/api/docs" },
          { label: "Status", href: "#status" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "#privacy" },
          { label: "Terms", href: "#terms" }
        ]
      }
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com", icon: "github" as const },
      { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const }
    ],
    copyright: "© 2025 Turbo Nuxt Starter. Built with Nuxt 4 + Turborepo."
  }
}

export const WithLinkedIn: Story = {
  args: {
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "#contact" }
        ]
      }
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com", icon: "github" as const },
      { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const },
      { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const }
    ],
    copyright: "© 2025 My Company. All rights reserved."
  }
}

export const MinimalFooter: Story = {
  args: {
    sections: [
      {
        title: "Links",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" }
        ]
      }
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com", icon: "github" as const }
    ],
    copyright: "© 2025 Simple App"
  }
}

export const NoSocialLinks: Story = {
  args: {
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "#help" },
          { label: "Contact", href: "#contact" }
        ]
      }
    ],
    socialLinks: [],
    copyright: "© 2025 Private Company"
  }
}

export const ExtensiveSections: Story = {
  args: {
    sections: [
      {
        title: "Products",
        links: [
          { label: "Web App", href: "#web" },
          { label: "Mobile App", href: "#mobile" },
          { label: "Desktop App", href: "#desktop" },
          { label: "API", href: "#api" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "Guides", href: "/guides" },
          { label: "API Reference", href: "/api" },
          { label: "Examples", href: "/examples" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" },
          { label: "Partners", href: "/partners" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Cookie Policy", href: "/cookies" },
          { label: "GDPR", href: "/gdpr" }
        ]
      }
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com", icon: "github" as const },
      { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const },
      { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const }
    ],
    copyright: "© 2025 Enterprise Corp. All rights reserved worldwide."
  }
}
