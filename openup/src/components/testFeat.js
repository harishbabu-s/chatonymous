import React from 'react';

const DynamicGrid = ({ items }) => {
    return (
        <div className="container">
            <div className="row">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="col-1 border p-2 text-center fs-6" style={{ backgroundColor: `#${item}` }} >{item}</div>
                        {/* Break to a new row after every 10 columns */}
                        {(index + 1) % 10 === 0 && <div className="w-100"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DynamicGrid;
