import { useState, useCallback, useRef } from 'react';

const MAX_HISTORY = 50;

const useUndoRedo = (initialState) => {
    const [present, setPresent] = useState(initialState);
    const pastRef = useRef([]);
    const futureRef = useRef([]);
    const debounceRef = useRef(null);

    const set = useCallback((newState) => {
        // Clear any pending debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            pastRef.current = [...pastRef.current, present].slice(-MAX_HISTORY);
            futureRef.current = [];
        }, 300);

        if (typeof newState === 'function') {
            setPresent(prev => {
                const next = newState(prev);
                return next;
            });
        } else {
            setPresent(newState);
        }
    }, [present]);

    // Force push to history immediately (used before set for proper undo)
    const pushToHistory = useCallback(() => {
        pastRef.current = [...pastRef.current, present].slice(-MAX_HISTORY);
        futureRef.current = [];
    }, [present]);

    const undo = useCallback(() => {
        if (pastRef.current.length === 0) return;

        const previous = pastRef.current[pastRef.current.length - 1];
        const newPast = pastRef.current.slice(0, -1);

        pastRef.current = newPast;
        futureRef.current = [present, ...futureRef.current];
        setPresent(previous);
    }, [present]);

    const redo = useCallback(() => {
        if (futureRef.current.length === 0) return;

        const next = futureRef.current[0];
        const newFuture = futureRef.current.slice(1);

        pastRef.current = [...pastRef.current, present];
        futureRef.current = newFuture;
        setPresent(next);
    }, [present]);

    // Replace state without tracking (for initial load)
    const reset = useCallback((newState) => {
        pastRef.current = [];
        futureRef.current = [];
        setPresent(newState);
    }, []);

    return {
        state: present,
        set,
        undo,
        redo,
        reset,
        pushToHistory,
        canUndo: pastRef.current.length > 0,
        canRedo: futureRef.current.length > 0,
    };
};

export default useUndoRedo;
