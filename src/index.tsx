import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './fonts.css';
import './index.css';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch render crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ef4444', fontFamily: 'sans-serif' }}>
          <h1>Something went wrong.</h1>
          <p>Please check the console for details.</p>
          <pre style={{ background: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// The production build ships the page already rendered (prerender.mjs), so React only has
// to attach to it. Hydrating inside a transition lets React split that work into short
// chunks instead of one long main-thread task (Total Blocking Time in PageSpeed).
// The dev server serves an empty #root and renders from scratch.
if (rootElement.hasChildNodes()) {
  React.startTransition(() => {
    ReactDOM.hydrateRoot(rootElement, app);
  });
} else {
  ReactDOM.createRoot(rootElement).render(app);
}