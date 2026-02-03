"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, Camera, RefreshCcw, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaceMeasurements {
    faceWidth: number;
    ipd: number;
    bridgeWidth: number;
    faceLength: number;
    confidence: number;
}

interface SizeRecommendation {
    size: 'Small' | 'Medium' | 'Large';
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
}

interface MeasurementSample {
    ipd: number;
    faceWidth: number;
    eyeWidth: number;
    timestamp: number;
}

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

// Anthropometric constants based on research
const ANTHROPOMETRIC_CONSTANTS = {
    // Average adult eye fissure length (corner to corner): 28-30mm
    EYE_FISSURE_LENGTH_MM: 29.0,

    // Average adult IPD: 58-68mm (median ~63mm)
    IPD_MIN: 54,
    IPD_MAX: 75,
    IPD_MEDIAN: 63,

    // Average face width (bizygomatic): 125-145mm
    FACE_WIDTH_MIN: 115,
    FACE_WIDTH_MAX: 160,

    // Typical ratios
    IPD_TO_FACE_WIDTH_RATIO: 0.46, // IPD is typically 46% of face width
    BRIDGE_TO_IPD_RATIO: 0.27, // Bridge is typically 27% of IPD
};

export function SizeFinder() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing...");
    const [measurements, setMeasurements] = useState<FaceMeasurements | null>(null);
    const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const faceApiRef = useRef<any>(null);
    const animationRef = useRef<number>(0);
    const measurementSamplesRef = useRef<MeasurementSample[]>([]);

    /**
     * Calculate median of an array
     */
    const median = (arr: number[]): number => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    /**
     * Calculate Median Absolute Deviation for outlier detection
     */
    const calculateMAD = (arr: number[]): number => {
        const med = median(arr);
        const deviations = arr.map(x => Math.abs(x - med));
        return median(deviations);
    };

    /**
     * Remove outliers using MAD method (more robust than standard deviation)
     */
    const removeOutliers = (arr: number[], threshold: number = 3): number[] => {
        const med = median(arr);
        const mad = calculateMAD(arr);

        if (mad === 0) return arr; // All values are identical

        return arr.filter(x => {
            const zScore = Math.abs(x - med) / (mad * 1.4826); // 1.4826 is consistency constant
            return zScore < threshold;
        });
    };

    /**
     * Improved calibration using multiple reference points
     */
    const calculatePixelToMm = (landmarks: any): { pixelToMm: number; confidence: number } => {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // Method 1: Eye fissure length (most reliable for frontal faces)
        const leftEyeWidthPx = Math.sqrt(
            Math.pow(leftEye[3].x - leftEye[0].x, 2) +
            Math.pow(leftEye[3].y - leftEye[0].y, 2)
        );
        const rightEyeWidthPx = Math.sqrt(
            Math.pow(rightEye[3].x - rightEye[0].x, 2) +
            Math.pow(rightEye[3].y - rightEye[0].y, 2)
        );

        const avgEyeWidthPx = (leftEyeWidthPx + rightEyeWidthPx) / 2;
        const calibration1 = ANTHROPOMETRIC_CONSTANTS.EYE_FISSURE_LENGTH_MM / avgEyeWidthPx;

        // Method 2: Nose width (less reliable but good for validation)
        const noseWidthPx = Math.sqrt(
            Math.pow(nose[4].x - nose[0].x, 2) +
            Math.pow(nose[4].y - nose[0].y, 2)
        );
        const NOSE_WIDTH_MM = 35; // Average nose width
        const calibration2 = NOSE_WIDTH_MM / noseWidthPx;

        // Calculate confidence based on agreement between methods
        const agreement = 1 - Math.abs(calibration1 - calibration2) / calibration1;
        const confidence = Math.max(0, Math.min(1, agreement));

        // Weight towards eye-based calibration (more reliable)
        const pixelToMm = calibration1 * 0.8 + calibration2 * 0.2;

        return { pixelToMm, confidence };
    };

    /**
     * Calculate IPD using multiple methods for accuracy
     */
    const calculateIPD = (landmarks: any, pixelToMm: number): number => {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        // Method 1: Pupil centers (most accurate)
        const leftPupil = {
            x: leftEye.reduce((a: any, p: any) => a + p.x, 0) / leftEye.length,
            y: leftEye.reduce((a: any, p: any) => a + p.y, 0) / leftEye.length
        };
        const rightPupil = {
            x: rightEye.reduce((a: any, p: any) => a + p.x, 0) / rightEye.length,
            y: rightEye.reduce((a: any, p: any) => a + p.y, 0) / rightEye.length
        };

        const ipdPx1 = Math.sqrt(
            Math.pow(rightPupil.x - leftPupil.x, 2) +
            Math.pow(rightPupil.y - leftPupil.y, 2)
        );

        // Method 2: Inner eye corners (alternative)
        const leftInner = leftEye[3];
        const rightInner = rightEye[0];
        const innerCornerDist = Math.sqrt(
            Math.pow(rightInner.x - leftInner.x, 2) +
            Math.pow(rightInner.y - leftInner.y, 2)
        );

        // IPD is typically inner corner distance + 2 * (half eye width)
        const avgEyeWidth = (
            Math.sqrt(Math.pow(leftEye[3].x - leftEye[0].x, 2) + Math.pow(leftEye[3].y - leftEye[0].y, 2)) +
            Math.sqrt(Math.pow(rightEye[3].x - rightEye[0].x, 2) + Math.pow(rightEye[3].y - rightEye[0].y, 2))
        ) / 2;

        const ipdPx2 = innerCornerDist + avgEyeWidth;

        // Average both methods
        const avgIpdPx = (ipdPx1 * 0.7 + ipdPx2 * 0.3); // Weight towards pupil method

        return avgIpdPx * pixelToMm;
    };

    /**
     * Validate and clamp measurements to realistic ranges
     */
    const validateMeasurement = (value: number, min: number, max: number, median: number): number => {
        // If out of range, pull towards median
        if (value < min) return min + (median - min) * 0.3;
        if (value > max) return max - (max - median) * 0.3;
        return value;
    };

    const calculateMeasurements = useCallback((landmarks: any): FaceMeasurements => {
        const jaw = landmarks.getJawOutline();

        // Get calibration
        const { pixelToMm, confidence: calibrationConfidence } = calculatePixelToMm(landmarks);

        // Calculate IPD
        const ipdRaw = calculateIPD(landmarks, pixelToMm);
        const ipd = validateMeasurement(
            ipdRaw,
            ANTHROPOMETRIC_CONSTANTS.IPD_MIN,
            ANTHROPOMETRIC_CONSTANTS.IPD_MAX,
            ANTHROPOMETRIC_CONSTANTS.IPD_MEDIAN
        );

        // Calculate face width (bizygomatic breadth approximation)
        const faceWidthPx = Math.sqrt(
            Math.pow(jaw[16].x - jaw[0].x, 2) +
            Math.pow(jaw[16].y - jaw[0].y, 2)
        );
        const faceWidthRaw = faceWidthPx * pixelToMm;
        const faceWidth = validateMeasurement(
            faceWidthRaw,
            ANTHROPOMETRIC_CONSTANTS.FACE_WIDTH_MIN,
            ANTHROPOMETRIC_CONSTANTS.FACE_WIDTH_MAX,
            135
        );

        // Validate IPD-to-face-width ratio
        const ratio = ipd / faceWidth;
        let confidenceAdjustment = 1.0;
        if (ratio < 0.38 || ratio > 0.54) {
            // Ratio is off, reduce confidence
            confidenceAdjustment = 0.7;
        }

        // Calculate bridge width based on IPD
        const bridgeWidth = Math.round(ipd * ANTHROPOMETRIC_CONSTANTS.BRIDGE_TO_IPD_RATIO);

        // Face length (approximate)
        const faceLength = Math.round(faceWidth * 1.3);

        const confidence = calibrationConfidence * confidenceAdjustment;

        return {
            faceWidth: Math.round(faceWidth),
            ipd: Math.round(ipd),
            bridgeWidth,
            faceLength,
            confidence
        };
    }, []);

    const getRecommendation = useCallback((m: FaceMeasurements): SizeRecommendation => {
        // Use both face width and IPD for more accurate sizing
        const sizeScore = (m.faceWidth * 0.6) + (m.ipd * 2.0); // Weighted combination

        if (sizeScore < 200) {
            return { size: 'Small', lensWidth: 48, bridgeWidth: 17, templeLength: 135 };
        } else if (sizeScore < 230) {
            return { size: 'Medium', lensWidth: 52, bridgeWidth: 19, templeLength: 140 };
        } else {
            return { size: 'Large', lensWidth: 56, bridgeWidth: 21, templeLength: 145 };
        }
    }, []);

    const drawOverlay = useCallback((ctx: CanvasRenderingContext2D, landmarks: any, videoWidth: number, videoHeight: number) => {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        // Calculate scaling factors
        const scaleX = canvasWidth / videoWidth;
        const scaleY = canvasHeight / videoHeight;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const jaw = landmarks.getJawOutline();

        // Helper function to scale and mirror coordinates
        const scalePoint = (p: any) => ({
            x: canvasWidth - (p.x * scaleX), // Mirror horizontally
            y: p.y * scaleY
        });

        // Eye positions
        const leftEyeCenter = scalePoint({
            x: leftEye.reduce((a: number, p: any) => a + p.x, 0) / leftEye.length,
            y: leftEye.reduce((a: number, p: any) => a + p.y, 0) / leftEye.length
        });
        const rightEyeCenter = scalePoint({
            x: rightEye.reduce((a: number, p: any) => a + p.x, 0) / rightEye.length,
            y: rightEye.reduce((a: number, p: any) => a + p.y, 0) / rightEye.length
        });

        // IPD line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(leftEyeCenter.x, leftEyeCenter.y);
        ctx.lineTo(rightEyeCenter.x, rightEyeCenter.y);
        ctx.stroke();

        // Eye markers
        ctx.setLineDash([]);
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(leftEyeCenter.x, leftEyeCenter.y, 5, 0, Math.PI * 2);
        ctx.arc(rightEyeCenter.x, rightEyeCenter.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Face width line (jaw)
        const leftJaw = scalePoint(jaw[0]);
        const rightJaw = scalePoint(jaw[16]);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(leftJaw.x, leftJaw.y);
        ctx.lineTo(rightJaw.x, rightJaw.y);
        ctx.stroke();

        // Calculate measurements for display
        const m = calculateMeasurements(landmarks);

        // Measurements box with confidence indicator
        const boxHeight = 100;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(8, 8, 180, boxHeight);

        // Confidence bar
        const confBarWidth = 164;
        const confBarHeight = 4;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(16, 16, confBarWidth, confBarHeight);
        ctx.fillStyle = m.confidence > 0.8 ? '#22c55e' : m.confidence > 0.6 ? '#eab308' : '#ef4444';
        ctx.fillRect(16, 16, confBarWidth * m.confidence, confBarHeight);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`IPD: ${m.ipd}mm`, 16, 38);
        ctx.fillText(`Face Width: ${m.faceWidth}mm`, 16, 56);
        ctx.fillText(`Bridge: ${m.bridgeWidth}mm`, 16, 74);

        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#aaa';
        ctx.fillText(`Confidence: ${Math.round(m.confidence * 100)}%`, 16, 92);
    }, [calculateMeasurements]);

    const startScan = async () => {
        setIsScanning(true);
        setScanProgress(0);
        setMeasurements(null);
        setRecommendation(null);
        setError(null);
        setIsTracking(false);
        measurementSamplesRef.current = [];
        setStatusText("Requesting camera...");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                }
            });
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

            setStatusText("Loading AI models...");
            const faceapi = await import('face-api.js');
            faceApiRef.current = faceapi;

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
            ]);

            setStatusText("Position your face in the frame");

            let frameCount = 0;
            const requiredFrames = 90; // Collect more samples for better accuracy
            const samples: MeasurementSample[] = [];

            const detect = async () => {
                if (!videoRef.current || !faceApiRef.current) return;

                try {
                    const detections = await faceApiRef.current
                        .detectSingleFace(videoRef.current, new faceApiRef.current.TinyFaceDetectorOptions({
                            inputSize: 416,
                            scoreThreshold: 0.5
                        }))
                        .withFaceLandmarks(true);

                    if (detections && canvasRef.current && videoRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx) {
                            const videoWidth = videoRef.current.videoWidth;
                            const videoHeight = videoRef.current.videoHeight;
                            drawOverlay(ctx, detections.landmarks, videoWidth, videoHeight);
                        }

                        setIsTracking(true);

                        // Collect measurement sample
                        const { pixelToMm, confidence } = calculatePixelToMm(detections.landmarks);

                        if (confidence > 0.5) { // Only collect high-confidence samples
                            const leftEye = detections.landmarks.getLeftEye();
                            const rightEye = detections.landmarks.getRightEye();
                            const jaw = detections.landmarks.getJawOutline();

                            const leftEyeWidthPx = Math.sqrt(
                                Math.pow(leftEye[3].x - leftEye[0].x, 2) +
                                Math.pow(leftEye[3].y - leftEye[0].y, 2)
                            );
                            const rightEyeWidthPx = Math.sqrt(
                                Math.pow(rightEye[3].x - rightEye[0].x, 2) +
                                Math.pow(rightEye[3].y - rightEye[0].y, 2)
                            );
                            const avgEyeWidth = (leftEyeWidthPx + rightEyeWidthPx) / 2;

                            const ipd = calculateIPD(detections.landmarks, pixelToMm);
                            const faceWidthPx = Math.sqrt(
                                Math.pow(jaw[16].x - jaw[0].x, 2) +
                                Math.pow(jaw[16].y - jaw[0].y, 2)
                            );
                            const faceWidth = faceWidthPx * pixelToMm;

                            samples.push({
                                ipd,
                                faceWidth,
                                eyeWidth: avgEyeWidth,
                                timestamp: Date.now()
                            });

                            frameCount++;
                        }

                        const progress = Math.min(100, (frameCount / requiredFrames) * 100);
                        setScanProgress(progress);

                        if (progress < 25) setStatusText("Detecting facial landmarks...");
                        else if (progress < 50) setStatusText("Calibrating measurements...");
                        else if (progress < 75) setStatusText("Collecting data samples...");
                        else setStatusText("Finalizing analysis...");

                        if (frameCount >= requiredFrames) {
                            // Process collected samples with outlier rejection
                            const ipdValues = samples.map(s => s.ipd);
                            const faceWidthValues = samples.map(s => s.faceWidth);

                            const cleanedIPD = removeOutliers(ipdValues);
                            const cleanedFaceWidth = removeOutliers(faceWidthValues);

                            // Calculate final measurements using median (more robust than mean)
                            const finalIPD = median(cleanedIPD);
                            const finalFaceWidth = median(cleanedFaceWidth);

                            // Validate final measurements
                            const validatedIPD = validateMeasurement(
                                finalIPD,
                                ANTHROPOMETRIC_CONSTANTS.IPD_MIN,
                                ANTHROPOMETRIC_CONSTANTS.IPD_MAX,
                                ANTHROPOMETRIC_CONSTANTS.IPD_MEDIAN
                            );

                            const validatedFaceWidth = validateMeasurement(
                                finalFaceWidth,
                                ANTHROPOMETRIC_CONSTANTS.FACE_WIDTH_MIN,
                                ANTHROPOMETRIC_CONSTANTS.FACE_WIDTH_MAX,
                                135
                            );

                            const bridgeWidth = Math.round(validatedIPD * ANTHROPOMETRIC_CONSTANTS.BRIDGE_TO_IPD_RATIO);
                            const faceLength = Math.round(validatedFaceWidth * 1.3);

                            // Calculate confidence based on sample consistency
                            const ipdMAD = calculateMAD(cleanedIPD);
                            const ipdConsistency = 1 - Math.min(1, ipdMAD / 5); // Lower MAD = higher consistency
                            const sampleRetention = cleanedIPD.length / ipdValues.length;
                            const confidence = Math.min(1, ipdConsistency * sampleRetention);

                            const finalMeasurements: FaceMeasurements = {
                                ipd: Math.round(validatedIPD),
                                faceWidth: Math.round(validatedFaceWidth),
                                bridgeWidth,
                                faceLength,
                                confidence
                            };

                            const finalRecommendation = getRecommendation(finalMeasurements);

                            setMeasurements(finalMeasurements);
                            setRecommendation(finalRecommendation);

                            if (streamRef.current) {
                                streamRef.current.getTracks().forEach(t => t.stop());
                            }
                            setIsScanning(false);
                            return;
                        }
                    } else {
                        if (canvasRef.current) {
                            const ctx = canvasRef.current.getContext('2d');
                            if (ctx) ctx.clearRect(0, 0, 640, 480);
                        }
                        setIsTracking(false);
                        setStatusText("Looking for face...");
                    }
                } catch (e) {
                    console.error('Detection error:', e);
                }

                animationRef.current = requestAnimationFrame(detect);
            };

            detect();

        } catch (err: any) {
            console.error('Size Finder error:', err);
            setError(err.message || 'Camera access failed');
            setIsScanning(false);
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    return (
        <Card className="p-8 glass-dark border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Scan className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">AI Size Finder</h3>
                    <p className="text-xs text-zinc-500">State-of-the-art facial measurement analysis</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isScanning && !measurements && !error && (
                    <motion.div
                        key="initial"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Advanced AI algorithm with multi-frame averaging, outlier rejection, and anthropometric validation for precise measurements.
                        </p>
                        <Button
                            onClick={startScan}
                            className="w-full h-14 rounded-2xl font-bold text-lg bg-white text-black hover:bg-zinc-200"
                        >
                            Start Face Scan
                        </Button>
                    </motion.div>
                )}

                {isScanning && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                                playsInline
                                muted
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                width={640}
                                height={480}
                            />

                            {!isTracking && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-40 h-56 border-2 border-dashed border-white/30 rounded-full" />
                                </div>
                            )}

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-2 rounded-full">
                                <p className={`text-xs font-bold ${isTracking ? 'text-green-400' : 'text-white'}`}>
                                    {statusText}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Analysis Progress</span>
                                <span className="text-primary font-bold">{Math.round(scanProgress)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {measurements && recommendation && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Recommended Size</p>
                                <h4 className="text-4xl font-black text-white">{recommendation.size}</h4>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Confidence: {Math.round(measurements.confidence * 100)}%
                                </p>
                            </div>
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-[10px] text-zinc-500 uppercase mb-1">IPD</p>
                                <p className="text-xl font-bold text-white">{measurements.ipd}<span className="text-xs text-zinc-500 ml-1">mm</span></p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-[10px] text-zinc-500 uppercase mb-1">Face Width</p>
                                <p className="text-xl font-bold text-white">{measurements.faceWidth}<span className="text-xs text-zinc-500 ml-1">mm</span></p>
                            </div>
                        </div>

                        <div className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
                            <p className="text-sm font-medium text-white mb-2">Recommended Frame Specs</p>
                            <p className="text-xs text-zinc-400">
                                Lens: <span className="text-white font-bold">{recommendation.lensWidth}mm</span> •
                                Bridge: <span className="text-white font-bold">{recommendation.bridgeWidth}mm</span> •
                                Temple: <span className="text-white font-bold">{recommendation.templeLength}mm</span>
                            </p>
                        </div>

                        <Button
                            onClick={() => { setMeasurements(null); setRecommendation(null); }}
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Scan Again
                        </Button>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Camera className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                        <p className="text-white font-bold mb-2">Camera Access Required</p>
                        <p className="text-zinc-500 text-sm mb-6">{error}</p>
                        <Button onClick={startScan} variant="outline" className="border-white/10 text-white">
                            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
