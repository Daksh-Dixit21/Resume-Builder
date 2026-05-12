import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const PageBreakIndicator = ({ children, enabled = false }) => {
    const containerRef = useRef(null);
    const [showWarning, setShowWarning] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkHeight = () => {
            if (enabled && containerRef.current) {
                const height = containerRef.current.offsetHeight;
                // Letter size is 11 inches = 1056px at 96 DPI
                const pageHeight = 1056;
                const warningThreshold = pageHeight; // Show warning only when exceeding page height

                setShowWarning(height > warningThreshold);
                setIsOverflowing(height > pageHeight);
            }
        };

        // Check height after component mounts and when window resizes
        if (!enabled) {
            setShowWarning(false);
            setIsOverflowing(false);
            return;
        }

        checkHeight();
        window.addEventListener('resize', checkHeight);

        // Also check after a short delay to ensure content is fully rendered
        const timeoutId = setTimeout(checkHeight, 100);

        return () => {
            window.removeEventListener('resize', checkHeight);
            clearTimeout(timeoutId);
        };
    }, [children, enabled]);

    return (
        <div className="relative">
            <div ref={containerRef}>
                {children}
            </div>

            {/* Page break warning indicator - hidden in print */}
            {showWarning && (
                <div className={`absolute -bottom-2 left-0 right-0 flex items-center justify-center py-2 px-4 rounded-b-lg border-t-2 print:hidden ${
                    isOverflowing
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                }`}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                        {isOverflowing
                            ? 'Content exceeds one page - consider shortening your resume'
                            : 'Approaching page limit - review content length'
                        }
                    </span>
                </div>
            )}

            {/* Visual page break line - hidden in print */}
            {enabled && showWarning && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-300 opacity-50 print:hidden"></div>}
        </div>
    );
};

export default PageBreakIndicator;
