"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, RefreshCcw, X, Pause, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface VirtualTryOnProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    productImage?: string;
}

/**
 * Kalman Filter for smooth landmark tracking
 */
class KalmanFilter {
    private x: number; // State
    private p: number; // Error covariance
    private q: number; // Process noise
    private r: number; // Measurement noise

    constructor(initialValue: number, processNoise = 0.001, measurementNoise = 0.1) {
        this.x = initialValue;
        this.p = 1;
        this.q = processNoise;
        this.r = measurementNoise;
    }

    update(measurement: number): number {
        // Prediction
        this.p = this.p + this.q;

        // Update
        const k = this.p / (this.p + this.r); // Kalman gain
        this.x = this.x + k * (measurement - this.x);
        this.p = (1 - k) * this.p;

        return this.x;
    }

    reset(value: number) {
        this.x = value;
        this.p = 1;
    }
}

/**
 * Temporal smoothing buffer for stable rendering
 */
class TemporalBuffer {
    private buffer: number[] = [];
    private maxSize: number;

    constructor(size: number = 5) {
        this.maxSize = size;
    }

    add(value: number): number {
        this.buffer.push(value);
        if (this.buffer.length > this.maxSize) {
            this.buffer.shift();
        }

        // Weighted average favoring recent values
        let sum = 0;
        let weightSum = 0;
        for (let i = 0; i < this.buffer.length; i++) {
            const weight = i + 1; // Linear weighting
            sum += this.buffer[i] * weight;
            weightSum += weight;
        }
        return sum / weightSum;
    }

    clear() {
        this.buffer = [];
    }
}

export function VirtualTryOn({ isOpen, onClose, productName = 'Glasses', productImage }: VirtualTryOnProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backBufferRef = useRef<HTMLCanvasElement | null>(null); // Double buffering
    const glassesImageRef = useRef<HTMLImageElement | null>(null);
    const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('Initializing...');
    const [fps, setFps] = useState(0);

    const streamRef = useRef<MediaStream | null>(null);
    const faceLandmarkerRef = useRef<any>(null);
    const animationRef = useRef<number>(0);

    // Kalman filters for smooth tracking
    const filtersRef = useRef<{
        leftEyeX: KalmanFilter;
        leftEyeY: KalmanFilter;
        rightEyeX: KalmanFilter;
        rightEyeY: KalmanFilter;
        angle: KalmanFilter;
        scale: KalmanFilter;
    } | null>(null);

    // Temporal buffers for additional smoothing
    const buffersRef = useRef<{
        centerX: TemporalBuffer;
        centerY: TemporalBuffer;
        width: TemporalBuffer;
    } | null>(null);

    // FPS tracking
    const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

    // Last valid pose for interpolation during brief detection failures
    const lastValidPoseRef = useRef<{
        leftEye: { x: number; y: number };
        rightEye: { x: number; y: number };
        angle: number;
        scale: number;
        timestamp: number;
    } | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        // Initialize filters and buffers
        filtersRef.current = {
            leftEyeX: new KalmanFilter(0, 0.001, 0.05),
            leftEyeY: new KalmanFilter(0, 0.001, 0.05),
            rightEyeX: new KalmanFilter(0, 0.001, 0.05),
            rightEyeY: new KalmanFilter(0, 0.001, 0.05),
            angle: new KalmanFilter(0, 0.0005, 0.03),
            scale: new KalmanFilter(1, 0.001, 0.05),
        };

        buffersRef.current = {
            centerX: new TemporalBuffer(3),
            centerY: new TemporalBuffer(3),
            width: new TemporalBuffer(4),
        };

        const init = async () => {
            try {
                // Step 1: Load and process glasses image
                setLoadingStatus('Loading glasses image...');
                if (productImage) {
                    try {
                        const isExternal = productImage.startsWith('http');
                        const imgSrc = isExternal
                            ? `/api/image-proxy?url=${encodeURIComponent(productImage)}`
                            : productImage;

                        const response = await fetch(imgSrc);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);

                        const img = new Image();
                        await new Promise<void>((resolve) => {
                            img.onload = () => {
                                glassesImageRef.current = img;

                                // Advanced image processing
                                const tempCanvas = document.createElement('canvas');
                                tempCanvas.width = img.naturalWidth;
                                tempCanvas.height = img.naturalHeight;
                                const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

                                if (tempCtx) {
                                    tempCtx.drawImage(img, 0, 0);
                                    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                                    const data = imageData.data;
                                    const width = tempCanvas.width;
                                    const height = tempCanvas.height;

                                    // Remove white background with edge preservation
                                    const severWidth = Math.floor(width * 0.06);
                                    for (let y = 0; y < height; y++) {
                                        for (let x = 0; x < width; x++) {
                                            const idx = (y * width + x) * 4;
                                            const r = data[idx], g = data[idx + 1], b = data[idx + 2];

                                            // Remove white/light colors
                                            if (r > 190 && g > 190 && b > 190) {
                                                data[idx + 3] = 0;
                                            }

                                            // Sever hinges
                                            if (x < severWidth || x > (width - severWidth)) {
                                                data[idx + 3] = 0;
                                            }
                                        }
                                    }

                                    // Connected component analysis - keep largest component
                                    const labels = new Int32Array(width * height).fill(-1);
                                    let nextLabel = 0;
                                    const components: number[][] = [];

                                    for (let y = 0; y < height; y++) {
                                        for (let x = 0; x < width; x++) {
                                            const idx = y * width + x;
                                            if (data[idx * 4 + 3] > 0 && labels[idx] === -1) {
                                                const currentLabel = nextLabel++;
                                                const stack = [idx];
                                                const component = [];
                                                labels[idx] = currentLabel;

                                                while (stack.length > 0) {
                                                    const p = stack.pop()!;
                                                    component.push(p);
                                                    const px = p % width, py = Math.floor(p / width);
                                                    const neighbors = [[px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]];

                                                    for (const [nx, ny] of neighbors) {
                                                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                                            const nIdx = ny * width + nx;
                                                            if (data[nIdx * 4 + 3] > 0 && labels[nIdx] === -1) {
                                                                labels[nIdx] = currentLabel;
                                                                stack.push(nIdx);
                                                            }
                                                        }
                                                    }
                                                }
                                                components.push(component);
                                            }
                                        }
                                    }

                                    if (components.length > 0) {
                                        components.sort((a, b) => b.length - a.length);
                                        const largestComponent = new Set(components[0]);
                                        for (let i = 0; i < width * height; i++) {
                                            if (!largestComponent.has(i)) data[i * 4 + 3] = 0;
                                        }
                                    }

                                    tempCtx.putImageData(imageData, 0, 0);
                                    processedCanvasRef.current = tempCanvas;
                                }
                                resolve();
                            };
                            img.onerror = () => resolve();
                            img.src = blobUrl;
                        });
                    } catch (imgErr) {
                        console.error('Image fetch failed:', imgErr);
                    }
                }

                // Step 2: Get high-quality camera stream
                setLoadingStatus('Requesting camera access...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user',
                        frameRate: { ideal: 60, min: 30 } // Request 60fps
                    }
                });

                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await new Promise<void>((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.onloadedmetadata = () => {
                                videoRef.current?.play();
                                resolve();
                            };
                        }
                    });
                }

                // Step 3: Initialize MediaPipe with optimized settings
                setLoadingStatus('Initializing AI tracking...');
                const vision = await import('@mediapipe/tasks-vision');
                const { FaceLandmarker, FilesetResolver } = vision;

                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm"
                );

                try {
                    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                        baseOptions: {
                            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                            delegate: "GPU"
                        },
                        outputFaceBlendshapes: false, // Disable for performance
                        runningMode: "VIDEO",
                        numFaces: 1,
                        minFaceDetectionConfidence: 0.5,
                        minFacePresenceConfidence: 0.5,
                        minTrackingConfidence: 0.5
                    });
                } catch (gpuErr) {
                    console.warn("GPU not supported, using CPU:", gpuErr);
                    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                        baseOptions: {
                            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                            delegate: "CPU"
                        },
                        outputFaceBlendshapes: false,
                        runningMode: "VIDEO",
                        numFaces: 1
                    });
                }

                // Create back buffer for double buffering
                if (canvasRef.current) {
                    backBufferRef.current = document.createElement('canvas');
                    backBufferRef.current.width = canvasRef.current.width;
                    backBufferRef.current.height = canvasRef.current.height;
                }

                if (isMounted) {
                    setIsLoaded(true);
                    startDetection();
                }

            } catch (err: any) {
                console.error('VTO init error:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to initialize. Please check camera permissions.');
                }
            }
        };

        const startDetection = () => {
            const faceLandmarker = faceLandmarkerRef.current;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const backBuffer = backBufferRef.current;

            if (!video || !canvas || !backBuffer || !faceLandmarker) return;

            const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
            const backCtx = backBuffer.getContext('2d', { alpha: false, willReadFrequently: false });

            if (!ctx || !backCtx) return;

            let lastVideoTime = -1;
            let lastRenderedPose: typeof lastValidPoseRef.current = null;
            let detectionFailureCount = 0;
            const MAX_FAILURE_FRAMES = 10; // Increased tolerance - use last pose for up to 10 frames

            // Exponential moving average for ultra-smooth transitions
            const EMA_ALPHA = 0.3; // Lower = smoother but more lag
            let emaLeftEyeX = 0, emaLeftEyeY = 0;
            let emaRightEyeX = 0, emaRightEyeY = 0;
            let emaAngle = 0;
            let emaScale = 0;
            let emaInitialized = false;

            const renderLoop = () => {
                if (!isMounted) return;

                const now = performance.now();

                // FPS calculation
                fpsCounterRef.current.frames++;
                if (now - fpsCounterRef.current.lastTime >= 1000) {
                    setFps(fpsCounterRef.current.frames);
                    fpsCounterRef.current.frames = 0;
                    fpsCounterRef.current.lastTime = now;
                }

                if (isPaused) {
                    animationRef.current = requestAnimationFrame(renderLoop);
                    return;
                }

                // Draw video to back buffer (mirrored)
                backCtx.save();
                backCtx.scale(-1, 1);
                backCtx.drawImage(video, -backBuffer.width, 0, backBuffer.width, backBuffer.height);
                backCtx.restore();

                let currentPose: typeof lastValidPoseRef.current = null;

                // Process landmarks only when video time changes
                if (video.currentTime !== lastVideoTime) {
                    lastVideoTime = video.currentTime;

                    try {
                        const results = faceLandmarker.detectForVideo(video, now);

                        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                            setIsTracking(true);
                            detectionFailureCount = 0;

                            const landmarks = results.faceLandmarks[0];

                            // Enhanced eye landmark points for better accuracy
                            const leftEyePoints = [33, 133, 160, 159, 158, 157, 173, 153, 144, 145, 153, 154, 155];
                            const rightEyePoints = [362, 263, 387, 386, 385, 384, 398, 380, 373, 374, 381, 382, 383];

                            const getPoint = (idx: number) => ({
                                x: (1 - landmarks[idx].x) * backBuffer.width,
                                y: landmarks[idx].y * backBuffer.height
                            });

                            // Calculate raw eye positions
                            const leftEyeRaw = {
                                x: leftEyePoints.reduce((acc, idx) => acc + getPoint(idx).x, 0) / leftEyePoints.length,
                                y: leftEyePoints.reduce((acc, idx) => acc + getPoint(idx).y, 0) / leftEyePoints.length
                            };

                            const rightEyeRaw = {
                                x: rightEyePoints.reduce((acc, idx) => acc + getPoint(idx).x, 0) / rightEyePoints.length,
                                y: rightEyePoints.reduce((acc, idx) => acc + getPoint(idx).y, 0) / rightEyePoints.length
                            };

                            // Apply Kalman filtering for smooth tracking
                            const filters = filtersRef.current!;
                            const leftEyeFiltered = {
                                x: filters.leftEyeX.update(leftEyeRaw.x),
                                y: filters.leftEyeY.update(leftEyeRaw.y)
                            };

                            const rightEyeFiltered = {
                                x: filters.rightEyeX.update(rightEyeRaw.x),
                                y: filters.rightEyeY.update(rightEyeRaw.y)
                            };

                            // Calculate angle with filtering
                            const angleRaw = Math.atan2(
                                rightEyeFiltered.y - leftEyeFiltered.y,
                                rightEyeFiltered.x - leftEyeFiltered.x
                            );
                            const angleFiltered = filters.angle.update(angleRaw);

                            // Calculate face width for scaling
                            const faceWidthRaw = Math.sqrt(
                                Math.pow(getPoint(454).x - getPoint(234).x, 2) +
                                Math.pow(getPoint(454).y - getPoint(234).y, 2)
                            );

                            const buffers = buffersRef.current!;
                            const faceWidthSmooth = buffers.width.add(faceWidthRaw);

                            // Apply exponential moving average for additional smoothing
                            if (!emaInitialized) {
                                emaLeftEyeX = leftEyeFiltered.x;
                                emaLeftEyeY = leftEyeFiltered.y;
                                emaRightEyeX = rightEyeFiltered.x;
                                emaRightEyeY = rightEyeFiltered.y;
                                emaAngle = angleFiltered;
                                emaScale = faceWidthSmooth;
                                emaInitialized = true;
                            } else {
                                emaLeftEyeX = EMA_ALPHA * leftEyeFiltered.x + (1 - EMA_ALPHA) * emaLeftEyeX;
                                emaLeftEyeY = EMA_ALPHA * leftEyeFiltered.y + (1 - EMA_ALPHA) * emaLeftEyeY;
                                emaRightEyeX = EMA_ALPHA * rightEyeFiltered.x + (1 - EMA_ALPHA) * emaRightEyeX;
                                emaRightEyeY = EMA_ALPHA * rightEyeFiltered.y + (1 - EMA_ALPHA) * emaRightEyeY;
                                emaAngle = EMA_ALPHA * angleFiltered + (1 - EMA_ALPHA) * emaAngle;
                                emaScale = EMA_ALPHA * faceWidthSmooth + (1 - EMA_ALPHA) * emaScale;
                            }

                            currentPose = {
                                leftEye: { x: emaLeftEyeX, y: emaLeftEyeY },
                                rightEye: { x: emaRightEyeX, y: emaRightEyeY },
                                angle: emaAngle,
                                scale: emaScale,
                                timestamp: now
                            };

                            lastValidPoseRef.current = currentPose;

                        } else {
                            // No face detected - use last valid pose for extended period
                            detectionFailureCount++;
                            if (detectionFailureCount <= MAX_FAILURE_FRAMES && lastValidPoseRef.current) {
                                currentPose = lastValidPoseRef.current;
                                // Keep tracking status active during interpolation
                            } else {
                                setIsTracking(false);
                                // Still use last pose even after max failures to prevent blinking
                                if (lastValidPoseRef.current) {
                                    currentPose = lastValidPoseRef.current;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Detection error:', e);
                        detectionFailureCount++;
                        // Use last valid pose even on errors
                        if (lastValidPoseRef.current) {
                            currentPose = lastValidPoseRef.current;
                        }
                    }
                } else {
                    // Video time hasn't changed, use last rendered pose for continuity
                    currentPose = lastRenderedPose || lastValidPoseRef.current;
                }

                // ALWAYS render glasses if we have ANY pose (current or last)
                // This ensures continuous rendering without gaps
                const poseToRender = currentPose || lastRenderedPose || lastValidPoseRef.current;
                if (poseToRender) {
                    const drawSource = processedCanvasRef.current || glassesImageRef.current;

                    if (drawSource && (drawSource instanceof HTMLCanvasElement ||
                        (drawSource instanceof HTMLImageElement && drawSource.naturalWidth > 0))) {

                        const centerX = (poseToRender.leftEye.x + poseToRender.rightEye.x) / 2;
                        const centerY = (poseToRender.leftEye.y + poseToRender.rightEye.y) / 2;

                        // Apply temporal smoothing to center position
                        const buffers = buffersRef.current!;
                        const smoothCenterX = buffers.centerX.add(centerX);
                        const smoothCenterY = buffers.centerY.add(centerY);

                        const glassesWidth = poseToRender.scale * 1.05;
                        const aspectRatio = (drawSource instanceof HTMLCanvasElement ? drawSource.height : drawSource.naturalHeight) /
                            (drawSource instanceof HTMLCanvasElement ? drawSource.width : drawSource.naturalWidth);
                        const glassesHeight = glassesWidth * aspectRatio;

                        // Draw shadow for realism
                        backCtx.save();
                        backCtx.translate(smoothCenterX, smoothCenterY);
                        backCtx.rotate(poseToRender.angle + Math.PI);

                        // Soft shadow
                        backCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                        backCtx.shadowBlur = 8;
                        backCtx.shadowOffsetY = 3;

                        const offsetY = -glassesHeight * 0.05;

                        backCtx.drawImage(
                            drawSource,
                            -glassesWidth / 2,
                            -glassesHeight / 2 + offsetY,
                            glassesWidth,
                            glassesHeight
                        );
                        backCtx.restore();

                        // Store this pose as last rendered for next frame
                        lastRenderedPose = poseToRender;
                    }
                }

                // Copy back buffer to front buffer (eliminates tearing/blinking)
                ctx.drawImage(backBuffer, 0, 0);

                animationRef.current = requestAnimationFrame(renderLoop);
            };

            renderLoop();
        };

        init();

        return () => {
            isMounted = false;
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            if (faceLandmarkerRef.current) {
                faceLandmarkerRef.current.close();
                faceLandmarkerRef.current = null;
            }
            setIsLoaded(false);
            setIsTracking(false);
        };
    }, [isOpen, isPaused, productImage]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[900px] max-w-[95vw] p-0 overflow-hidden bg-black border-none">
                <DialogTitle className="sr-only">Virtual Try-On - {productName}</DialogTitle>
                <DialogDescription className="sr-only">
                    Virtually try on {productName} using your camera with state-of-the-art AI tracking.
                </DialogDescription>

                <div className="relative w-full" style={{ aspectRatio: '640/480' }}>
                    {!isLoaded && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-sm md:text-lg font-bold text-white uppercase tracking-widest">{loadingStatus}</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-30 p-4 md:p-8 text-center">
                            <Camera className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-4" />
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Camera Error</h3>
                            <p className="text-zinc-400 mb-6 text-xs md:text-sm">{error}</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="text-white border-white/20">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                            </Button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="hidden"
                        playsInline
                        muted
                    />

                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        width={640}
                        height={480}
                    />

                    {isLoaded && (
                        <>
                            <div className="absolute top-2 md:top-4 left-2 md:left-4 z-40">
                                <div className="flex items-center gap-1.5 md:gap-3 bg-black/70 backdrop-blur-md px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isTracking ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 animate-pulse'}`} />
                                    <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider">
                                        {isPaused ? 'Paused' : isTracking ? 'AI Tracking' : 'Scanning...'}
                                    </span>
                                    <span className="hidden md:inline text-[9px] text-zinc-400 ml-2">{fps} FPS</span>
                                </div>
                            </div>

                            <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
                                <div className="bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl text-center border border-white/10 shadow-2xl">
                                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-1">Live Preview</p>
                                    <p className="text-base font-bold text-white truncate">{productName}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 z-40">
                                <Button
                                    onClick={() => setIsPaused(p => !p)}
                                    className="bg-black/70 text-white hover:bg-white/10 backdrop-blur-md rounded-full h-10 w-10 md:h-12 md:w-12 border border-white/10"
                                >
                                    {isPaused ? <Play className="w-4 h-4 md:w-5 md:h-5" /> : <Pause className="w-4 h-4 md:w-5 md:h-5" />}
                                </Button>
                            </div>

                            {productImage && (
                                <div className="hidden md:block absolute top-4 right-16 z-40">
                                    <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                        <img
                                            src={productImage}
                                            alt={productName}
                                            className="w-16 h-10 object-contain brightness-110"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Button
                        onClick={onClose}
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 md:top-4 right-2 md:right-4 z-40 bg-black/70 text-white hover:bg-white/10 backdrop-blur-md rounded-full w-10 h-10 md:w-10 md:h-10 border border-white/10"
                    >
                        <X className="w-5 h-5 md:w-5 md:h-5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
