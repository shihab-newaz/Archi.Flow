# Button Component

A portfolio-grade, 3D animated button component built with **Composition Pattern** for maximum flexibility.

## Quick Start

```tsx
import { Button } from '@/components/custom/Button'

<Button onClick={handleClick}>
  <Button.Label>Click Me</Button.Label>
</Button>
```

## Composition API

The button uses compound components. You compose what you need:

```tsx
<Button variant="primary" color="cyan" size="lg">
  <Button.Icon><SaveIcon /></Button.Icon>
  <Button.Label>Save Changes</Button.Label>
  <Button.Shortcut>⌘S</Button.Shortcut>
</Button>
```

### Available Sub-components

| Component         | Description                                    |
|-------------------|------------------------------------------------|
| `Button.Label`    | The button text. Fades out during loading.     |
| `Button.Icon`     | Icon wrapper. Fades out during loading.        |
| `Button.Spinner`  | Loading spinner. Only renders when `isLoading` is true. |
| `Button.Shortcut` | Keyboard shortcut badge in the corner.         |

## Props (on `<Button>`)

### Visual Props

| Prop            | Type                                      | Default     | Description                     |
|-----------------|-------------------------------------------|-------------|---------------------------------|
| `variant`       | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style                    |
| `size`          | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | Button size                     |
| `color`         | `'cyan' \| 'pink' \| 'emerald'`           | `'cyan'`    | Accent color                    |
| `glowIntensity` | `'none' \| 'subtle' \| 'strong'`          | `'subtle'`  | 3D glow effect intensity        |
| `textColor`     | `string`                                  | —           | Custom text color (CSS value)   |
| `bgColor`       | `string`                                  | —           | Custom background color         |

### State Props

| Prop        | Type      | Default | Description                        |
|-------------|-----------|---------|-----------------------------------|
| `isLoading` | `boolean` | `false` | Shows spinner, disables clicks    |
| `isError`   | `boolean` | `false` | Shake animation + red glow        |
| `isSuccess` | `boolean` | `false` | Green pulse glow                  |
| `disabled`  | `boolean` | `false` | Disables the button               |

### Event Props

| Prop              | Type                                                | Description                                     |
|-------------------|-----------------------------------------------------|-------------------------------------------------|
| `onClick`         | `(e: MouseEvent) => void \| Promise<void>`          | Click handler (supports async)                  |
| `debounceMs`      | `number`                                            | Debounce delay in ms                            |
| `throttleMs`      | `number`                                            | Throttle delay in ms                            |
| `disableOnClick`  | `boolean`                                           | Auto-disable while async `onClick` is running   |

## Examples

### Loading State

```tsx
<Button isLoading>
  <Button.Spinner text="SAVING..." />
  <Button.Label>Save</Button.Label>
</Button>
```

### With Icon

```tsx
<Button color="pink">
  <Button.Icon><HeartIcon /></Button.Icon>
  <Button.Label>Like</Button.Label>
</Button>
```

### Async Submit with Auto-Disable

```tsx
<Button 
  onClick={async () => {
    await saveData()
  }}
  disableOnClick
>
  <Button.Label>Submit</Button.Label>
</Button>
```

### Debounced Search

```tsx
<Button onClick={handleSearch} debounceMs={300}>
  <Button.Icon><SearchIcon /></Button.Icon>
  <Button.Label>Search</Button.Label>
</Button>
```

## Folder Structure

```
Button/
├── index.ts              # Main export
├── types.ts              # TypeScript types
├── ButtonContext.tsx     # Shared context
├── components/           # Compound components
│   ├── Root.tsx
│   ├── Label.tsx
│   ├── Icon.tsx
│   ├── Shortcut.tsx
│   └── Spinner.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── useThrottle.ts
└── css/
    └── Button.module.css
```
