import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Scissors } from 'lucide-react';

const PageBreakIndicator = ({ children, enabled = false }) => {
    const containerRef = useRef(null);
    const [showWarning, setShowWarning] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [containerHeight, setContainerHeight] = useState(0);

    // A4 height is 297mm ≈ 11.69 inches. 
    // At 96 DPI, this is exactly 1123 pixels.
    const A4_PAGE_HEIGHT = 1123; 

    useEffect(() => {
        const checkHeight = () => {
            if (enabled && containerRef.current) {
                const height = containerRef.current.offsetHeight;
                setContainerHeight(height);
                setShowWarning(height > A4_PAGE_HEIGHT - 50); // Warn when getting close
                setIsOverflowing(height > A4_PAGE_HEIGHT);
            }
        };

        if (!enabled) {
            setShowWarning(false);
            setIsOverflowing(false);
            return;
        }

        checkHeight();
        
        // Monitor for any changes in content height (images loading, typing, etc.)
        const resizeObserver = new ResizeObserver(checkHeight);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', checkHeight);
        const timeoutId = setTimeout(checkHeight, 200);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkHeight);
            clearTimeout(timeoutId);
        };
    }, [children, enabled]);

    if (!enabled) return <div id="resume-preview-container">{children}</div>;

    return (
        <div className="relative group">
            <div ref={containerRef} id="resume-preview-container" className="relative transition-all duration-300">
                {children}

                {/* Visual Page Break Line */}
                <div 
                    className="absolute left-0 right-0 border-t-2 border-dashed pointer-events-none transition-all duration-300 print:hidden"
                    style={{ 
                        top: `${A4_PAGE_HEIGHT}px`,
                        borderColor: isOverflowing ? '#ef4444' : '#94a3b8',
                        opacity: 0.6,
                        zIndex: 20
                    }}
                >
                    <div className="absolute right-0 top-0 -translate-y-full px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-tl-md flex items-center gap-1">
                        <Scissors size={10} />
                        A4 PAGE 1 ENDS HERE
                    </div>
                </div>

                {/* Page Labels in Gutters (Desktop Only) */}
                <div className="absolute -left-12 top-4 h-full pointer-events-none hidden xl:block print:hidden">
                    <div className="sticky top-10 flex flex-col gap-2">
                        <div className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 rotate-[-90deg] origin-left translate-x-4">
                            PAGE 1
                        </div>
                        {isOverflowing && (
                            <div 
                                className="px-2 py-1 bg-red-50 border border-red-200 rounded text-[10px] font-black text-red-500 rotate-[-90deg] origin-left translate-x-4"
                                style={{ marginTop: `${A4_PAGE_HEIGHT - 60}px` }}
                            >
                                PAGE 2
                            </div>
                        )}
                    </div>
                </div>

                {/* Overflow Highlight */}
                {isOverflowing && (
                    <div 
                        className="absolute left-0 right-0 bottom-0 pointer-events-none bg-red-50/10 print:hidden"
                        style={{ top: `${A4_PAGE_HEIGHT}px` }}
                    />
                )}
            </div>

            {/* Warning Message */}
            {showWarning && (
                <div className={`mt-4 flex items-center justify-between p-3 rounded-lg border animate-in fade-in slide-in-from-top-1 print:hidden ${
                    isOverflowing
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isOverflowing ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">
                                {isOverflowing ? 'Content Overflow' : 'Approaching Limit'}
                            </p>
                            <p className="text-xs opacity-90">
                                {isOverflowing 
                                    ? `Your resume is ${Math.round(containerHeight - A4_PAGE_HEIGHT)}px too long for a single page.`
                                    : 'You are close to exceeding one page. The dashed line shows the cutoff.'}
                            </p>
                        </div>
                    </div>
                    {isOverflowing && (
                        <div className="text-[10px] font-black bg-red-100 px-2 py-1 rounded uppercase tracking-wider">
                            Page 2 Active
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PageBreakIndicator;

