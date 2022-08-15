import React from 'react'

class MyErrorBoundary extends React.Component {
    state = {
        error: null,
    };

    static getDerivedStateFromError(error) {
        // Update state so next render shows fallback UI.
        return { error: error };
    }

    componentDidCatch(error, info) {
        // Log the error to an error reporting service
        //logErrorToExampleService(error, info);
    }

    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            return (
                <div>
                    <p>There was a rendering error!</p>
                    <p>{this.state.error}</p>
                </div>

            );
        }
        return this.props.children;
    }
}

export default MyErrorBoundary