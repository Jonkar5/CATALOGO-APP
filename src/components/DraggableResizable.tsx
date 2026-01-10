import React from 'react';
import { Rnd } from 'react-rnd';
import type { LayoutConfig } from '../types';

interface DraggableResizableProps {
    children: React.ReactNode;
    initialLayout?: LayoutConfig;
    onLayoutChange?: (layout: LayoutConfig) => void;
    disabled?: boolean;
    className?: string;
}

const DEFAULT_LAYOUT: LayoutConfig = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
};

export function DraggableResizable({
    children,
    initialLayout = DEFAULT_LAYOUT,
    onLayoutChange,
    disabled = false,
    className = ''
}: DraggableResizableProps) {
    const [layout, setLayout] = React.useState<LayoutConfig>(initialLayout);

    // Sync local state when external initialLayout changes
    React.useEffect(() => {
        setLayout(initialLayout);
    }, [initialLayout]);

    const handleDragStop = (_e: any, d: { x: number; y: number }) => {
        const newLayout = { ...layout, x: d.x, y: d.y };
        setLayout(newLayout);
        onLayoutChange?.(newLayout);
    };

    const handleResizeStop = (
        _e: any,
        _direction: any,
        ref: HTMLElement,
        _delta: any,
        position: { x: number; y: number }
    ) => {
        const newLayout = {
            x: position.x,
            y: position.y,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height)
        };
        setLayout(newLayout);
        onLayoutChange?.(newLayout);
    };

    if (disabled) {
        return (
            <div
                className={className}
                style={{
                    width: layout.width,
                    height: layout.height,
                    position: 'absolute',
                    left: layout.x,
                    top: layout.y
                }}
            >
                {children}
            </div>
        );
    }

    return (
        <Rnd
            size={{ width: layout.width, height: layout.height }}
            position={{ x: layout.x, y: layout.y }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            disableDragging={disabled}
            enableResizing={!disabled}
            bounds="parent"
            minWidth={100}
            minHeight={50}
            className={`transition-shadow ${!disabled ? 'border-2 border-dashed border-blue-300' : ''} ${className}`}
            style={{
                zIndex: disabled ? 0 : 50,
                backgroundColor: 'white'
            }}
        >
            <div className="w-full h-full">
                {children}
            </div>
        </Rnd>
    );
}
