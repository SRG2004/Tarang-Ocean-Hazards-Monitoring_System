import React from 'react';

export class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Temporarily Unavailable</h3>
          <p className="text-gray-600 mb-4">
            The interactive map is currently experiencing technical issues.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Retry Map
          </button>
          <div className="mt-4 text-sm text-gray-500">
            Other dashboard features remain fully functional
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}