import React from 'react';

import "./Map.scss"


/**
 * @function GoogleMap - Handle displaying the google maps location
 * @prop {} ...
 */
const GoogleMap = () => {
    return (
        <div className="Map-container">
            <iframe src="https://silextrack.fr/live-garderlecap/" />
        </div>
    );
}

export default GoogleMap;
