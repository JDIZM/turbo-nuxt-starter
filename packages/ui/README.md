# UI Package

Shared Vue component library with Tailwind CSS for the Turbo Nuxt Starter monorepo.

## Overview

This package provides a collection of reusable UI components built with:

- **Vue 3** with Composition API and TypeScript
- **Tailwind CSS** for styling
- **Headless UI** for accessible components (Modal)
- Atomic Design principles (atoms, molecules, organisms)

## Installation

This package is already included in the monorepo. To use it in your app:

```bash
pnpm install
```

## Usage

### Import Components

```vue
<script setup lang="ts">
import { Button, Input, Card, Badge, Modal, Alert, Spinner } from 'ui'
import { ref } from 'vue'

const isModalOpen = ref(false)
const inputValue = ref('')
</script>

<template>
  <div>
    <Button variant="primary" @click="isModalOpen = true">Open Modal</Button>
    <Input v-model="inputValue" label="Email" type="email" placeholder="Enter your email" />
    <Card padding="md" shadow="lg">
      <Badge variant="success">Active</Badge>
      <p>Card content here</p>
    </Card>
    <Alert variant="info" title="Info" dismissible>This is an info alert</Alert>
    <Spinner size="md" color="primary" text="Loading..." />
    <Modal v-model:open="isModalOpen" title="Example Modal">
      <p>Modal content</p>
      <template #footer>
        <Button variant="secondary" @click="isModalOpen = false">Close</Button>
      </template>
    </Modal>
  </div>
</template>
```

### Import Styles

In your app's entry point or component, import the Tailwind CSS:

```typescript
import 'ui/styles'
```

### Configure Tailwind

Make sure your app's `tailwind.config.ts` includes the UI package in the content array:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './node_modules/ui/**/*.{vue,js,ts}' // Include UI package
  ],
  theme: {
    extend: {}
  }
}

export default config
```

## Components

### Button

Feature-rich button component with variants, sizes, and states.

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `loading`: boolean (default: false)
- `fullWidth`: boolean (default: false)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')

**Example:**

```vue
<Button variant="primary" size="lg" :loading="isLoading" @click="handleClick">
  Click Me
</Button>
```

### Input

Text input component with label, error states, and validation.

**Props:**

- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' (default: 'text')
- `modelValue`: string | number
- `label`: string
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean (default: false)
- `required`: boolean (default: false)
- `fullWidth`: boolean (default: false)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Example:**

```vue
<Input
  v-model="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  :error="emailError"
  required
/>
```

### Card

Container component with configurable padding, shadows, and hover effects.

**Props:**

- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `hoverable`: boolean (default: false)
- `bordered`: boolean (default: true)
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'xl' (default: 'sm')

**Example:**

```vue
<Card padding="lg" shadow="xl" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Badge

Small status indicator with variants and sizes.

**Props:**

- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `rounded`: boolean (default: false)

**Example:**

```vue
<Badge variant="success" rounded>Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

### Modal

Accessible modal dialog using Headless UI.

**Props:**

- `open`: boolean (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')
- `showClose`: boolean (default: true)

**Slots:**

- `default`: Modal content
- `footer`: Modal footer actions

**Example:**

```vue
<Modal v-model:open="isOpen" title="Confirm Action" size="lg">
  <p>Are you sure you want to continue?</p>
  <template #footer>
    <Button variant="secondary" @click="isOpen = false">Cancel</Button>
    <Button variant="primary" @click="confirm">Confirm</Button>
  </template>
</Modal>
```

### Alert

Notification component with variants and dismissible option.

**Props:**

- `variant`: 'info' | 'success' | 'warning' | 'danger' (default: 'info')
- `title`: string
- `dismissible`: boolean (default: false)

**Example:**

```vue
<Alert variant="success" title="Success!" dismissible @close="handleClose">
  Your changes have been saved successfully.
</Alert>
```

### Spinner

Loading spinner with configurable size and color.

**Props:**

- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: 'primary' | 'secondary' | 'white' | 'gray' (default: 'primary')
- `text`: string

**Example:**

```vue
<Spinner size="lg" color="primary" text="Loading data..." />
```

## Theming

The UI package uses Tailwind CSS with a custom theme. You can extend or override the theme in your app's `tailwind.config.ts`.

### Color Palette

The package includes primary and secondary color scales:

- **Primary**: Blue shades (50-950)
- **Secondary**: Gray shades (50-950)

## Development

### Adding New Components

1. Create component in `src/components/`
2. Export from `src/index.ts`
3. Add type exports
4. Update this README with usage examples

### Linting

```bash
pnpm lint
```

## TypeScript

All components are fully typed with TypeScript. Props interfaces are exported for use in your applications.

```typescript
import type { ButtonProps, InputProps } from 'ui'
```

## Legacy Components

The package also includes legacy components for backward compatibility:

- `Card` (legacy card.vue)
- `Gradient`
- `Page`

These will be deprecated in future versions.

## Contributing

When adding new components:

1. Follow the existing component structure
2. Use TypeScript for prop definitions
3. Include accessibility features
4. Add proper documentation
5. Export types and components

## License

Private package for the Turbo Nuxt Starter monorepo.
