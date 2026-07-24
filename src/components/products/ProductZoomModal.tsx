"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Image from "next/image";

interface ProductZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
    productName: string;
}

export function ProductZoomModal({
    isOpen,
    onClose,
    images,
    initialIndex = 0,
    productName
}: ProductZoomModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const touchDistanceRef = useRef<number | null>(null);
    const lastTapRef = useRef<number>(0);

    // Sync initialIndex when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            resetZoom();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen, initialIndex]);

    const resetZoom = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        lastPosRef.current = { x: 0, y: 0 };
    }, []);

    const handleIndexChange = (newIndex: number) => {
        resetZoom();
        setCurrentIndex(newIndex);
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = () => {
        setScale(prev => {
            const next = Math.max(prev - 0.5, 1);
            if (next === 1) resetZoom();
            return next;
        });
    };

    // Double tap toggle zoom
    const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            if (scale > 1) {
                resetZoom();
            } else {
                setScale(2.5);
            }
        }
        lastTapRef.current = now;
    };

    // Mouse drag handling when zoomed in
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || scale <= 1) return;
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition({ x: newX, y: newY });
        lastPosRef.current = { x: newX, y: newY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch events for mobile (Pinch & Pan)
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDoubleTap(e);

        if (e.touches.length === 2) {
            // Pinch start
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            touchDistanceRef.current = dist;
        } else if (e.touches.length === 1 && scale > 1) {
            // Pan start
            const touch = e.touches[0];
            dragStartRef.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && touchDistanceRef.current !== null) {
            // Pinching
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const delta = dist - touchDistanceRef.current;

            setScale(prev => {
                const next = Math.min(Math.max(prev + delta * 0.01, 1), 4);
                if (next === 1) resetZoom();
                return next;
            });
            touchDistanceRef.current = dist;
        } else if (e.touches.length === 1 && isDragging && scale > 1) {
            // Panning
            const touch = e.touches[0];
            const newX = touch.clientX - dragStartRef.current.x;
            const newY = touch.clientY - dragStartRef.current.y;
            setPosition({ x: newX, y: newY });
            lastPosRef.current = { x: newX, y: newY };
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) {
            touchDistanceRef.current = null;
        }
        if (e.touches.length === 0) {
            setIsDragging(false);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") handleIndexChange((currentIndex + 1) % images.length);
            if (e.key === "ArrowLeft") handleIndexChange((currentIndex - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex, images.length, onClose]);

    if (!isOpen || !images.length) return null;

    const currentImage = images[currentIndex] || '/images/dfd.png';
    const isDataUri = currentImage.startsWith('data:');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col select-none touch-none">
                {/* Header Controls */}
                <div className="relative z-10 flex items-center justify-between px-4 py-4 md:px-8 border-b border-white/10 bg-black/40">
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-sm md:text-base line-clamp-1">{productName}</span>
                        <span className="text-white/50 text-xs font-semibold">
                            {currentIndex + 1} / {images.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Zoom Controls */}
                        <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/10">
                            <button
                                onClick={handleZoomOut}
                                disabled={scale <= 1}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-white text-xs font-bold px-2">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={handleZoomIn}
                                disabled={scale >= 4}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        {scale > 1 && (
                            <button
                                onClick={resetZoom}
                                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                title="Reset Zoom"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all ml-2"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Viewport */}
                <div
                    ref={containerRef}
                    className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Navigation Buttons (Desktop) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => handleIndexChange((currentIndex - 1 + images.length) % images.length)}
                                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => handleIndexChange((currentIndex + 1) % images.length)}
                                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image Container with Transforms */}
                    <div
                        className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center transition-transform duration-100 ease-out"
                        style={{
                            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
                        }}
                    >
                        {isDataUri ? (
                            <img
                                src={currentImage}
                                alt={productName}
                                className="max-w-full max-h-full object-contain p-4 select-none pointer-events-none"
                            />
                        ) : (
                            <Image
                                src={currentImage}
                                alt={productName}
                                fill
                                className="object-contain p-4 select-none pointer-events-none"
                                priority
                                unoptimized={isDataUri}
                            />
                        )}
                    </div>

                    {/* Mobile helper hint */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-white/70 text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
                        Double-tap or Pinch to Zoom · Drag to Pan
                    </div>
                </div>

                {/* Thumbnails Footer Strip */}
                {images.length > 1 && (
                    <div className="relative z-10 py-4 px-4 bg-black/40 border-t border-white/10 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleIndexChange(idx)}
                                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                                    currentIndex === idx ? "border-primary scale-110 shadow-lg shadow-primary/30" : "border-white/20 opacity-50 hover:opacity-100"
                                }`}
                            >
                                {img.startsWith('data:') ? (
                                    <img src={img} alt="" className="w-full h-full object-contain p-1 bg-white/5" />
                                ) : (
                                    <Image src={img} alt="" fill className="object-contain p-1 bg-white/5" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AnimatePresence>
    );
}
