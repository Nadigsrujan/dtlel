import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return 'dark'; // Default to dark for a premium experience
    });

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        const root = document.body;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            document.documentElement.style.setProperty('color-scheme', 'dark');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
            document.documentElement.style.setProperty('color-scheme', 'light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return { theme, toggleTheme };
}
