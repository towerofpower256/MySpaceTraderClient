import React, { useEffect } from 'react';

export default function Page(props) {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top on page change
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h5>{props.title}</h5>
            </div>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    );
};