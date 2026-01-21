# Deployment Guide - NEMSA Electric Meter Portal

This guide covers deploying the NEMSA Electric Meter Portal to Vercel with optimal performance configurations.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Node.js 18+ and npm 8+
- Vercel CLI installed (`npm i -g vercel`)
- Git repository

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nemsa/electric-meter-portal)

### Manual Deployment

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd electric-meter-portal
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Build and Test Locally**
   ```bash
   npm run build:production
   npm run serve
   ```

4. **Deploy to Vercel**
   ```bash
   # Preview deployment
   npm run deploy:preview
   
   # Production deployment
   npm run deploy:production
   ```

## ⚙️ Configuration

### Environment Variables

Set these in your Vercel dashboard or via CLI:

```bash
# Required
NEXT_PUBLIC_DOMAIN=https://nemsa-portal.gov.ng

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Optional - Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

### Vercel Project Settings

1. **Build Configuration**
   - Build Command: `npm run build:production`
   - Output Directory: `out`
   - Install Command: `npm install`

2. **Environment Variables** (in Vercel Dashboard)
   ```
   NEXT_PUBLIC_DOMAIN = https://nemsa-portal.gov.ng
   NODE_ENV = production
   ```

3. **Domain Configuration**
   - Add your custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_DOMAIN` environment variable

## 🔧 Performance Optimizations

### Implemented Optimizations

1. **Static Export Configuration**
   - Next.js static export for optimal performance
   - Automatic code splitting and lazy loading
   - Image optimization for web delivery

2. **Caching Strategy**
   - Static assets: 1 year cache
   - HTML pages: No cache (for updates)
   - API routes: Custom cache headers

3. **Bundle Optimization**
   - Tree shaking enabled
   - Package imports optimized
   - React Compiler enabled

4. **Performance Monitoring**
   - Web Vitals tracking
   - Bundle size monitoring
   - Performance budget enforcement

### Performance Targets

- **First Contentful Paint (FCP)**: < 2.0s
- **Largest Contentful Paint (LCP)**: < 3.0s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Total Bundle Size**: < 1MB

## 📊 Monitoring and Analytics

### Built-in Monitoring

1. **Web Vitals Tracking**
   - Automatic Core Web Vitals collection
   - Performance regression detection
   - Real user monitoring (RUM)

2. **Error Tracking**
   - Client-side error boundaries
   - Performance issue detection
   - Resource loading failures

3. **Bundle Analysis**
   ```bash
   npm run build:analyze
   ```

### Vercel Analytics Integration

Enable Vercel Analytics in your project dashboard for:
- Page view tracking
- Performance metrics
- User behavior insights

## 🛠️ Build Scripts

```bash
# Development
npm run dev                    # Start development server

# Building
npm run build                  # Standard build
npm run build:production       # Production build with optimizations
npm run build:analyze          # Build with bundle analyzer

# Testing
npm run type-check            # TypeScript type checking
npm run lint                  # ESLint checking
npm run test:lighthouse       # Lighthouse performance testing

# Deployment
npm run deploy:preview        # Deploy to preview URL
npm run deploy:production     # Deploy to production

# Utilities
npm run clean                 # Clean build artifacts
npm run optimize:images       # Optimize static images
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build:production
   ```

2. **Performance Issues**
   ```bash
   # Analyze bundle size
   npm run build:analyze
   
   # Run Lighthouse audit
   npm run test:lighthouse
   ```

3. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after changing environment variables
   - Check Vercel dashboard for correct variable names

### Performance Debugging

1. **Check Web Vitals**
   - Open browser DevTools
   - Check Console for Web Vitals logs
   - Use Lighthouse for detailed analysis

2. **Bundle Size Analysis**
   ```bash
   npm run build:analyze
   # Opens webpack-bundle-analyzer report
   ```

3. **Network Performance**
   - Check Network tab in DevTools
   - Verify static assets are cached properly
   - Ensure images are optimized

## 📈 Optimization Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up (if applicable)
- [ ] Performance monitoring enabled
- [ ] Bundle size under 1MB
- [ ] All Core Web Vitals in "Good" range
- [ ] Images optimized and properly sized
- [ ] Service worker registered (if enabled)
- [ ] Error boundaries implemented
- [ ] Accessibility compliance verified

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review build output for errors
3. Verify environment configuration
4. Test locally with production build

For performance issues:
1. Run Lighthouse audit
2. Check Web Vitals metrics
3. Analyze bundle size
4. Review network requests