import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }
  componentDidCatch(err, info) {
    console.error("UI error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <h1 className="h4 text-danger">Something went wrong.</h1>
          <pre className="small bg-light p-3 rounded">
            {String(this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
