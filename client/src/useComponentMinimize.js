import { useState, useEffect, useRef } from 'react';

const useComponentMinimize = initialIsMinimized => {
    const [isComponentMinimized, setIsComponentMinimized] =
        useState(initialIsMinimized);

    const ref = useRef(null);

    const handleHideDropdown = event => {
        if (event.key === 'Escape') {
            setIsComponentMinimized(false);
        }
    };

    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentMinimized(true);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleHideDropdown, true);
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('keydown', handleHideDropdown, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentMinimized, setIsComponentMinimized };
};

export default useComponentMinimize;
