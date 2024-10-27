import React, { useEffect, useState } from 'react';

import sample1 from '../assets/sample1.png'
import sample2 from '../assets/sample2.png'
import sample3 from '../assets/sample3.png'

const Samples = () => {
    const [position, setPosition] = useState(0);

    const items = [
        { id: 1, image: sample3, alt: "Image 3" },
        { id: 2, image: sample1, alt: "Image 1" },
        { id: 3, image: sample2, alt: "Image 2" },
        { id: 4, image: sample3, alt: "Image 3" },
        { id: 5, image: sample1, alt: "Image 1" },
        { id: 6, image: sample2, alt: "Image 2" },
        { id: 7, image: sample3, alt: "Image 3" },
        { id: 8, image: sample1, alt: "Image 1" },
        { id: 9, image: sample2, alt: "Image 2" },
    ];

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            setPosition(prev => {
                if (prev <= -100) {
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);
        return () => clearInterval(scrollInterval);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-lg"
            style={{ maxHeight: '80vh' }} >
            <div
                className="absolute transition-transform duration-1000"
                style={{ transform: `translateY(${position}%)` }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="py-4"
                    >
                        <img
                            src={item.image}
                            alt={item.alt}
                            className='image-fluid'
                            style={{ width: '100%' }}
                        />
                    </div>
                ))}
            </div>

            <div
                className="absolute transition-transform duration-1000"
                style={{ transform: `translateY(${position + 100}%)` }}
            >
                {items.map((item) => (
                    <div
                        key={`clone-${item.id}`}
                        className="py-4"
                    >
                        <img
                            src={item.image}
                            className="image-fluid"
                            style={{ width: '100%' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Samples;
