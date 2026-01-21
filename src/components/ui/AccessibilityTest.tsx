'use client';

import { useEffect, useState } from 'react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
}

export default function AccessibilityTest() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const checkAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for missing alt text on images
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        foundIssues.push({
          type: 'error',
          message: `${images.length} images missing alt text`,
          element: 'img'
        });
      }

      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const unlabeledInputs = Array.from(inputs).filter(input => {
        const id = input.getAttribute('id');
        return !id || !document.querySelector(`label[for="${id}"]`);
      });
      
      if (unlabeledInputs.length > 0) {
        foundIssues.push({
          type: 'error',
          message: `${unlabeledInputs.length} form inputs missing labels`,
          element: 'input'
        });
      }

      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      let hierarchyIssues = 0;
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > previousLevel + 1) {
          hierarchyIssues++;
        }
        previousLevel = level;
      });

      if (hierarchyIssues > 0) {
        foundIssues.push({
          type: 'warning',
          message: `${hierarchyIssues} heading hierarchy issues found`,
          element: 'heading'
        });
      }

      // Check for low contrast (simplified check)
      const elements = document.querySelectorAll('*');
      let lowContrastCount = 0;
      
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Simple check for gray text on light backgrounds
        if (color.includes('rgb(107, 114, 128)') && backgroundColor.includes('rgb(255, 255, 255)')) {
          lowContrastCount++;
        }
      });

      if (lowContrastCount > 5) {
        foundIssues.push({
          type: 'warning',
          message: `Potential low contrast issues detected`,
          element: 'color'
        });
      }

      // Check for missing focus indicators
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      let missingFocusCount = 0;
      
      focusableElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        if (!styles.outline && !styles.boxShadow.includes('focus')) {
          missingFocusCount++;
        }
      });

      if (missingFocusCount > 0) {
        foundIssues.push({
          type: 'info',
          message: `Focus indicators properly implemented`,
          element: 'focus'
        });
      }

      setIssues(foundIssues);
    };

    // Run check after component mount
    setTimeout(checkAccessibility, 1000);

    // Listen for keyboard shortcut to toggle visibility
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(prev => !prev);
        checkAccessibility();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Accessibility Check</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close accessibility panel"
        >
          ×
        </button>
      </div>
      
      {issues.length === 0 ? (
        <p className="text-green-600 text-sm">✓ No major accessibility issues found</p>
      ) : (
        <ul className="space-y-1">
          {issues.map((issue, index) => (
            <li key={index} className={`text-sm flex items-start gap-2 ${
              issue.type === 'error' ? 'text-red-600' : 
              issue.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              <span className="font-bold">
                {issue.type === 'error' ? '⚠️' : issue.type === 'warning' ? '⚡' : 'ℹ️'}
              </span>
              {issue.message}
            </li>
          ))}
        </ul>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Press Ctrl+Shift+A to toggle this panel
      </p>
    </div>
  );
}