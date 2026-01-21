'use client';

import { useEffect } from 'react';
import { register } from '@/utils/serviceWorker';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      register({
        onSuccess: (registration) => {
          console.log('Service Worker registered successfully:', registration);
        },
        onUpdate: (registration) => {
          console.log('Service Worker updated:', registration);
          // You could show a notification to the user about the update
        }
      });
    }
  }, []);

  return null;
}