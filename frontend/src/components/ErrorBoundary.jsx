import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Platform Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-md w-full border border-border bg-white p-12 text-center space-y-8">
            <h1 className="text-4xl font-serif">System Interruption.</h1>
            <p className="text-secondary font-serif italic">
              A critical error occurred while processing your data. Our engineering team has been notified.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full py-4 text-xs"
            >
              Restart System Node
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
