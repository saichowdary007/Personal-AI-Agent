import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here if needed
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-700 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded p-4 my-4">
          <h3 className="font-bold mb-2">Something went wrong.</h3>
          <pre className="overflow-x-auto text-xs">{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
