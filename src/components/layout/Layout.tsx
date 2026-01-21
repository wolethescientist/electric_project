import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import AccessibilityTest from '@/components/ui/AccessibilityTest';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import OfflineIndicator from '@/components/ui/OfflineIndicator';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Skip Links for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <a 
        href="#main-navigation" 
        className="skip-link"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
      
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Breadcrumb />
      </ErrorBoundary>
      
      <main 
        id="main-content" 
        className="flex-1 relative"
        role="main"
        aria-label="Main content"
      >
        <div className="min-h-full">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
      
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      
      {/* Offline indicator */}
      <OfflineIndicator />
      
      {/* Development-only accessibility testing */}
      <AccessibilityTest />
    </div>
  );
}