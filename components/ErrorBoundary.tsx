import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md bg-red-50 p-6 dark:bg-red-900">
          <h2 className="mb-2 font-semibold text-red-600 dark:text-red-300">Something went wrong.</h2>
          <p className="text-red-500 dark:text-red-400">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
