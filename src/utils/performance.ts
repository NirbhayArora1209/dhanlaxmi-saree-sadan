export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
    const duration = measure.duration;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(duration);
    
    // Keep only last 100 measurements
    const measurements = this.metrics.get(name)!;
    if (measurements.length > 100) {
      measurements.splice(0, measurements.length - 100);
    }

    return duration;
  }

  getAverageTime(name: string): number {
    const measurements = this.metrics.get(name);
    if (!measurements || measurements.length === 0) return 0;
    
    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
  }

  getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [name, measurements] of this.metrics.entries()) {
      if (measurements.length > 0) {
        result[name] = {
          average: this.getAverageTime(name),
          count: measurements.length,
          latest: measurements[measurements.length - 1] ?? 0
        };
      }
    }
    
    return result;
  }

  logMetrics(): void {
    console.group('Performance Metrics');
    const metrics = this.getMetrics();
    for (const [name, data] of Object.entries(metrics)) {
      console.log(`${name}: avg ${data.average.toFixed(2)}ms, latest ${data.latest.toFixed(2)}ms (${data.count} samples)`);
    }
    console.groupEnd();
  }
}

// Performance monitoring hook
export function usePerformanceMonitor(name: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  const start = () => monitor.startMeasure(name);
  const end = () => monitor.endMeasure(name);
  
  return { start, end };
}

// Image preloading utility
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
}

// Resource hints utility
export function addResourceHints() {
  const head = document.head;
  
  // DNS prefetch for external domains
  const dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
    'https://api.razorpay.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });
  
  // Preconnect to critical domains
  const preconnect = [
    'https://fonts.gstatic.com'
  ];
  
  preconnect.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });
}

// Web Vitals monitoring
// export function monitorWebVitals() {
//   if (typeof window === 'undefined') return;
//   // Monitor Core Web Vitals
//   import('web-vitals').then((webVitals) => {
//     webVitals.getCLS(console.log);
//     webVitals.getFID(console.log);
//     webVitals.getFCP(console.log);
//     webVitals.getLCP(console.log);
//     webVitals.getTTFB(console.log);
//   });
// }

// next.config.js additions for performance
export const performanceConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['images.unsplash.com', 'your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable compression
  compress: true,
  
  // Bundle analyzer
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  }
}; 