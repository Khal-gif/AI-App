# Next.js + Turbopack Setup Guide for Nano-Banana

## 🚀 Quick Start Commands

```bash
# 1. Create Next.js 14+ project with all optimizations
npx create-next-app@latest nano-banana --typescript --tailwind --eslint --app --import-alias "@/*"

cd nano-banana

# 2. Install shadcn/ui (MANDATORY for design system compliance)
npx shadcn@latest init

# 3. Install ALL required shadcn/ui components in one go
npx shadcn@latest add button card input label form navigation-menu dialog sheet dropdown-menu alert badge textarea select checkbox switch slider table skeleton avatar separator toast

# 4. Install Next.js + Canvas + State Management
npm install @next/bundle-analyzer next-themes next-auth @vercel/analytics @vercel/speed-insights konva react-konva zustand @types/konva use-image react-use-measure class-variance-authority clsx tailwind-merge

# 5. Install development tools
npm install -D turbo eslint-config-next @next/eslint-plugin-next prettier prettier-plugin-tailwindcss @types/node

# 6. Start development with Turbopack
npm run dev
```

## ⚡ Turbopack Benefits

**Speed Improvements:**
- **10x faster** cold starts vs Webpack
- **700x faster** updates (HMR) during development  
- **Native TypeScript support** - no transpilation needed
- **Incremental bundling** - only rebuilds what changed

**Key Features:**
- Built in Rust for maximum performance
- Zero-config setup with Next.js 14+
- Compatible with all existing Next.js features
- Seamless shadcn/ui integration

## 📁 Optimized Project Structure

```bash
nano-banana/                    # Root directory
├── app/                       # App Router (Next.js 14+)
│   ├── layout.tsx            # Design system root layout
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Tailwind v4 + design tokens
│   ├── dashboard/            # Main AI tool interface
│   │   ├── layout.tsx        # Dashboard layout
│   │   ├── page.tsx          # Dashboard home
│   │   └── editor/page.tsx   # Image editor
│   └── api/                  # API routes (proxy to FastAPI)
│       ├── generate/route.ts # Image generation
│       └── upload/route.ts   # File uploads
├── 
├── components/               # shadcn/ui + custom components
│   ├── ui/                  # Auto-generated shadcn/ui components
│   ├── canvas/              # Konva canvas components  
│   ├── forms/               # Form components
│   └── layout/              # Layout components
├── 
├── lib/                     # Utilities
│   ├── utils.ts            # shadcn/ui utilities
│   ├── store.ts            # Zustand global state
│   └── api.ts              # Backend API client
├── 
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript definitions
├── public/                  # Static assets
├── 
├── next.config.js          # Turbopack configuration
├── turbo.json             # Turbo optimization
└── package.json           # Dependencies
```

## 🎨 Design System Integration

### globals.css (Tailwind v4 + Design Tokens)
```css
@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  /* Design System Foundation */
  --font-sans: 'Mulish', system-ui, sans-serif;
  
  /* 8pt Grid Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  --font-size-5xl: 48px;
  
  /* Only 4 font weights allowed */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 8pt Grid Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
}
```

### Component Example (Design System Compliant)
```tsx
// components/canvas/ToolPalette.tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ToolPalette() {
  return (
    <Card className="w-80 p-6 space-y-4">  {/* 320px width, 24px padding, 16px gaps */}
      <CardHeader className="space-y-2 p-0">  {/* 8px gap, no extra padding */}
        <CardTitle className="text-xl font-semibold">  {/* 20px, 600 weight */}
          AI Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-0">  {/* 16px vertical spacing */}
        <Button className="h-10 px-6 w-full font-semibold">  {/* 40px height, 24px padding */}
          Generate Image
        </Button>
        
        <Button className="h-10 px-6 w-full font-medium" variant="outline">
          Character Consistency
        </Button>
        
        <Button className="h-10 px-6 w-full font-medium" variant="ghost">
          Multi-Image Blend
        </Button>
      </CardContent>
    </Card>
  )
}
```

## ⚙️ Development Workflow

### Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev --turbo",                    // Turbopack dev server
    "dev:debug": "next dev --turbo --inspect",   // Debug mode
    "build": "next build",                       // Production build
    "build:analyze": "ANALYZE=true next build",  // Bundle analysis
    "start": "next start",                       // Production server
    "lint": "next lint --fix",                   // Auto-fix linting
    "type-check": "tsc --noEmit",               // TypeScript check
    "validate": "npm run lint && npm run type-check" // Full validation
  }
}
```

### Daily Development Commands
```bash
# Start development (with Turbopack)
npm run dev

# Add new shadcn/ui component
npx shadcn@latest add [component-name]

# Validate code quality
npm run validate

# Analyze bundle size
npm run build:analyze

# Debug performance issues
npm run dev:debug
```

## 🚦 Performance Optimizations

### Turbopack Configuration (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverComponentsExternalPackages: ['konva'],
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['localhost'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
```

### Bundle Analysis
```bash
# Analyze what's in your bundle
npm run build:analyze

# Key metrics to watch:
# - First Load JS: < 100KB per page
# - Total bundle size: < 500KB
# - Image optimization: WebP/AVIF usage
```

## 📊 Performance Targets

### Development (Turbopack)
- **Cold start**: < 1 second
- **Hot reload**: < 100ms
- **Type checking**: Real-time
- **Build time**: 50% faster than Webpack

### Production
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s  
- **Time to Interactive**: < 3.8s
- **Bundle size**: < 200KB gzipped

## 🔧 Troubleshooting

### Common Issues
```bash
# If Turbopack fails to start
rm -rf .next && npm run dev

# If shadcn/ui components don't work
npx shadcn@latest init --force

# If TypeScript errors persist
npm run type-check

# If bundle size is too large
npm run build:analyze
```

## 🎯 Next Steps

1. **Follow the setup commands exactly**
2. **Install all shadcn/ui components upfront**
3. **Use design system tokens consistently**
4. **Leverage Turbopack for development speed**
5. **Monitor performance with built-in tools**
6. **Use @teamconsult methodology for decisions**

This setup provides maximum development velocity while maintaining strict design system compliance and optimal production performance.