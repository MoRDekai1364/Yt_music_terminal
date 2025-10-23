import React, { useState, useEffect } from 'react';

const SPINNER_CHARS = ['|', '/', '-', '\\'];

interface LoadingSpinnerProps {
    text: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCharIndex(prevIndex => (prevIndex + 1) % SPINNER_CHARS.length);
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center justify-center h-full text-[var(--color-text-dim)]">
            <span className="text-[var(--color-accent)] mr-2">[{SPINNER_CHARS[charIndex]}]</span>
            <span>{text}</span>
        </div>
    );
};

export default LoadingSpinner;