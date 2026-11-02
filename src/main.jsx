import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

// ============================================================================
// Robust Global Error Boundary - Prevents Blank Screen of Death
// Catches render exceptions and provides a 1-click automatic recovery
// ============================================================================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Share The Bite Runtime Exception Caught:', error, errorInfo);
  }

  handleRecovery = () => {
    localStorage.removeItem('Share The Bite_runtime_error');
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#ecfdf5',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#059669',
              fontSize: '28px'
            }}>
              🌱
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
              Share The Bite: Recovery Mode
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px' }}>
              A client-side state issue was detected. Click below to refresh your session and reload the verified sample products.
            </p>
            {this.state.error?.message && (
              <div style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '11px',
                color: '#475569',
                textAlign: 'left',
                fontFamily: 'monospace',
                marginBottom: '20px',
                wordBreak: 'break-word'
              }}>
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleRecovery}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '14px',
                backgroundColor: '#166534',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              🔄 Refresh &amp; Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// React Root Mount
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
