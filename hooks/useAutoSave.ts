import { useState, useEffect, useRef } from 'react';

export function useAutoSave(content: string, key: string = 'currentDraft', delay: number = 5000) {
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setIsSaving(true);
        timerRef.current = setTimeout(() => {
            localStorage.setItem(key, content);
            setLastSaved(new Date());
            setIsSaving(false);
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [content, key, delay]);

    const loadSaved = () => {
        return localStorage.getItem(key);
    };

    return { lastSaved, isSaving, loadSaved };
}
