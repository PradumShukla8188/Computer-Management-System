# CustomLoader Component

A flexible, reusable custom CSS-animated loading spinner component.

## Features

- **Full Screen Mode**: Take up the entire viewport
- **Parent Container Mode**: Automatically fit parent element dimensions
- **Custom CSS Animation**: Beautiful two-block animated spinner
- **Size Options**: Small, default, or large spinner sizes
- **Custom Height**: Specify exact height when needed
- **Backdrop Effect**: Optional blur backdrop for emphasis

## Import

```tsx
import { CustomLoader } from '@/components/common';
// or
import CustomLoader from '@/components/common/CustomLoader';
```

## Usage Examples

### 1. Full Screen Loader (Full Page)
```tsx
<CustomLoader 
  fullScreen 
  withBackdrop 
/>
```

### 2. Parent Container Loader (Auto Width)
```tsx
<div className="w-full">
  <CustomLoader />
</div>
```

### 3. Custom Height Loader
```tsx
<CustomLoader 
  height="400px" 
  size="large"
/>
```

### 4. Small Loader for Cards
```tsx
<CustomLoader 
  height="200px" 
  size="small"
/>
```

### 5. Dynamic Import Loading State
```tsx
const StudentList = dynamic(
  () => import("@/components/student/StudentList"), 
  { 
    ssr: true, 
    loading: () => <CustomLoader /> 
  }
);
```

### 6. Conditional Loading in Components
```tsx
function MyComponent() {
  const { data, isLoading } = useQuery(...);
  
  if (isLoading) {
    return <CustomLoader />;
  }
  
  return <div>{/* Your content */}</div>;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fullScreen` | `boolean` | `false` | If true, loader takes full viewport |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Spinner size |
| `height` | `string` | - | Custom height (e.g., "200px", "50vh") |
| `withBackdrop` | `boolean` | `false` | Show blur backdrop effect |

## Common Use Cases

### Loading State in Tables
```tsx
{isLoading ? (
  <CustomLoader height="400px" />
) : (
  <Table dataSource={data} />
)}
```

### Form Submission
```tsx
{isSubmitting && (
  <CustomLoader 
    fullScreen 
    withBackdrop 
  />
)}
```

### Page-Level Loading
```tsx
export default function Page() {
  const { data, isLoading } = useQuery(...);
  
  if (isLoading) {
    return <CustomLoader fullScreen />;
  }
  
  return <div>Page content</div>;
}
```
