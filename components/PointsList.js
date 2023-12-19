// components/PointsList.js

import React from 'react';

const PointsList = ({ pointsData, onPointSelect }) => {
    return (
        <ul>
            {pointsData.map((point, index) => (
                <li key={index} onClick={() => onPointSelect(point.Position)} style={{ cursor: 'pointer' }}>
                    {point.Name}
                </li>
            ))}
        </ul>
    );
}

export default PointsList;
