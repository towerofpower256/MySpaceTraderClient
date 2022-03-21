import React, { useEffect } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

export default function Page(props) {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top on page change
    }, []);

    return (
        <MyErrorBoundary>
            <div className="card">
                <div className="card-header">
                    <h5>{props.title}</h5>
                </div>
                <div className="card-body">
                    {props.children}
                </div>
            </div>
        </MyErrorBoundary>
    );
};