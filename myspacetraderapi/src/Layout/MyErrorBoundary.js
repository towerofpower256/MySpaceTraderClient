import React from 'react'

class MyErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }



    static getDerivedStateFromError(error) {
        // Update state so next render shows fallback UI.
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap', textAlign: "left" }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo ? this.state.errorInfo.componentStack : "No error info"}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default MyErrorBoundary