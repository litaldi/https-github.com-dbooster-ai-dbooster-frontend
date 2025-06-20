
# 🚀 DBooster - AI-Powered Database Query Optimizer

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Performance](https://img.shields.io/badge/Performance-A+-brightgreen)](https://web.dev/measure/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

> **Transform your database performance with AI-powered query optimization that reduces response times by up to 10x and cuts infrastructure costs by 60%.**

## ⚠️ License & Intellectual Property Notice

**All rights reserved © DBooster.**  
This project is protected under copyright and intellectual property laws.

No part of this codebase, design, or documentation may be copied, reused, published, or redistributed — in whole or in part — without **explicit prior written permission** from the DBooster team.

### 🚫 Prohibited Actions
- ❌ Forking or cloning the repository  
- ❌ Using any part of the design, code, or architecture in other projects  
- ❌ Sharing or republishing code, assets, or documentation  
- ❌ Commercial or derivative use without authorization

This is a **private and proprietary project**.  
**It is not open source. It is not available for public use.**

📧 For licensing inquiries: **legal@dbooster.ai**

---

## ✨ Features

### 🧠 AI-Powered Optimization
- **Smart Query Analysis**: Advanced SQL parsing and performance prediction
- **Automated Recommendations**: Get expert-level optimization suggestions instantly
- **Performance Benchmarking**: Compare query performance before and after optimization
- **Schema Intelligence**: Analyze table structures and suggest optimal indexing strategies

### 🎯 Enterprise-Ready
- **Repository Integration**: Scan entire codebases for query optimization opportunities
- **Team Collaboration**: Share optimizations and best practices across your team
- **Audit Logging**: Complete history of all optimization activities
- **Security First**: Enterprise-grade security with SOC 2 compliance

### 🎨 Beautiful User Experience
- **Modern Design**: Clean, responsive interface with thoughtful animations
- **Accessibility First**: WCAG 2.1 AA compliant with full keyboard navigation
- **Responsive Design**: Perfect experience across all devices
- **Performance Optimized**: Sub-100ms load times with intelligent caching

### 🔧 Developer Tools
- **Visual Query Builder**: Drag-and-drop query construction
- **Real-time Collaboration**: Multiple users can work on queries simultaneously
- **Export Options**: Multiple formats including JSON, CSV, and SQL
- **API Integration**: RESTful APIs for programmatic access

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Bun (recommended) or npm/yarn
- Modern browser with JavaScript enabled

### Installation

```bash
# Clone the repository (authorized personnel only)
git clone https://github.com/dbooster/dbooster-app.git
cd dbooster-app

# Install dependencies
bun install

# Start development server
bun dev
```

Visit `http://localhost:8080` to see the application running.

### Environment Setup

Create a `.env.local` file (copy from `.env.example`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: TanStack Query, Zustand
- **Testing**: Vitest, Testing Library
- **Deployment**: Vercel

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── navigation/     # Navigation & layout components
│   ├── support/        # Customer support components
│   └── ...            # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── services/           # API services
├── contexts/           # React contexts
└── types/              # TypeScript type definitions
```

## 🔐 Security

### Data Protection
- **Encryption**: All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Authentication**: Secure multi-factor authentication with OAuth providers
- **Query Isolation**: SQL queries are sandboxed and never stored permanently
- **Privacy First**: No sensitive data is logged or transmitted to external services

### Security Features
- **Row-Level Security (RLS)**: Database-level access control
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive sanitization
- **Security Headers**: CSP, HSTS, and other protective headers
- **Audit Logging**: Complete activity tracking

## ♿ Accessibility

DBooster is built with accessibility as a core principle:

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Readers**: Semantic HTML with comprehensive ARIA labels
- **Color Contrast**: Minimum 4.5:1 contrast ratio throughout
- **Focus Management**: Clear focus indicators and skip links

### Keyboard Shortcuts
- `Alt + S`: Skip to main content
- `Alt + N`: Navigate to main navigation
- `Alt + M`: Jump to main content area
- `Ctrl + /`: Show keyboard shortcuts help

## 📊 Performance

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)  
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Performance Monitoring
```bash
# Analyze bundle size
bun run analyze

# Run Lighthouse audit
bun run audit

# Performance testing
bun run test:performance
```

## 🧪 Testing & QA

### Running Tests
```bash
# Run all tests
bun test

# Run E2E tests
bun test:e2e

# Generate coverage report
bun test:coverage

# Access QA suite (development)
# Open browser console and run: showQASuite()
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Custom domain setup
vercel domains add yourdomain.com
```

### Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` (for OAuth redirects)

## 📞 Support

- 📧 **Email**: support@dbooster.ai
- 💬 **Live Chat**: Available 24/7 in the application
- 📖 **Documentation**: [docs.dbooster.ai](https://docs.dbooster.ai)
- 🐛 **Bug Reports**: Authorized personnel only

## 📄 License

This project is proprietary software owned by DBooster. All rights reserved.

See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the DBooster team</p>
  <p><strong>© 2025 DBooster. All rights reserved.</strong></p>
</div>
