
# DBooster - Database Query Optimization Platform

A modern, accessible database query optimization platform built with React, TypeScript, and Supabase. DBooster helps developers analyze, optimize, and monitor database queries with AI-powered suggestions and real-time performance insights.

## 🚀 Features

### Core Functionality
- **Query Analysis & Optimization** - AI-powered query performance analysis
- **Real-time Monitoring** - Live database performance metrics and alerts
- **Repository Management** - Connect and manage multiple database repositories
- **AI-Powered Suggestions** - Intelligent recommendations for query improvements
- **Performance Benchmarking** - Compare query performance across different implementations

### Authentication & Security
- **Multiple Auth Methods** - Email, phone, OAuth (GitHub, Google), and demo mode
- **Secure Session Management** - JWT-based authentication with auto-refresh
- **Row Level Security (RLS)** - Data isolation and secure access controls
- **Rate Limiting** - Built-in protection against abuse

### User Experience
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile
- **Dark/Light Mode** - System-aware theme switching
- **Accessibility First** - WCAG 2.1 AA compliant with screen reader support
- **Progressive Loading** - Optimized loading states and error handling
- **Keyboard Navigation** - Full keyboard accessibility support

### Developer Experience
- **TypeScript** - Full type safety throughout the application
- **Modern React** - Hooks, Context API, and functional components
- **Performance Optimized** - Code splitting, lazy loading, and memoization
- **Comprehensive Testing** - Unit tests and integration tests
- **Error Boundaries** - Graceful error handling and recovery

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Context + React Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dbooster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Database Setup

The application uses Supabase for backend services. The database schema includes:

- **Authentication** - User management and session handling
- **Profiles** - Extended user information and preferences
- **Repositories** - Database connection management
- **Queries** - Query storage and optimization history
- **Analytics** - Performance metrics and insights

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── dashboard/      # Dashboard-specific components
│   └── ...
├── pages/              # Route components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## 🔐 Authentication

DBooster supports multiple authentication methods:

### Email/Password
- Standard email and password authentication
- Email verification for new accounts
- Password reset functionality

### Phone Authentication
- SMS-based verification
- International phone number support
- Formatted phone number input

### OAuth Providers
- **GitHub** - Access to repository data and user profile
- **Google** - Quick sign-in with Google account

### Demo Mode
- No registration required
- Sample data for testing features
- Limited functionality for security

## 🎨 UI/UX Features

### Design System
- Consistent color palette and typography
- Responsive breakpoints for all screen sizes
- Smooth animations and transitions
- Loading states and skeleton screens

### Accessibility
- ARIA labels and semantic HTML
- Focus management and keyboard navigation
- Screen reader announcements
- High contrast mode support
- Reduced motion preferences

### Error Handling
- User-friendly error messages
- Graceful degradation on failures
- Retry mechanisms for failed requests
- Offline state detection

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

### Testing Strategy
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Feature workflow testing
- **Accessibility Tests** - ARIA and keyboard navigation
- **Performance Tests** - Load time and bundle size monitoring

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Configuration
Ensure all environment variables are properly set for production:
- Supabase URL and keys
- OAuth provider credentials
- API endpoints and secrets

## 📊 Performance

### Optimization Features
- **Code Splitting** - Lazy-loaded routes and components
- **Tree Shaking** - Eliminated unused code
- **Image Optimization** - WebP format and responsive images
- **Caching** - Strategic API response caching
- **Bundle Analysis** - Regular bundle size monitoring

### Performance Metrics
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5s

## 🔧 Configuration

### Theme Customization
Customize the theme in `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Custom primary colors
        }
      }
    }
  }
}
```

### Authentication Providers
Configure OAuth providers in Supabase dashboard:
1. Enable desired providers
2. Add redirect URLs
3. Configure OAuth app credentials

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write comprehensive tests for new features
- Ensure accessibility compliance
- Update documentation for API changes
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and authentication
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **Recharts** - Powerful charting library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join our community discussions

---

Built with ❤️ for developers who care about database performance and user experience.
