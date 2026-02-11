"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Camera, RefreshCcw, Scan, Ruler, Info, ShieldCheck, Zap, Target, Eye, Brain, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaceMeshEngine, Face3DMeasurements } from "@/lib/ai/FaceMeshEngine";

interface SizeRecommendation {
    size: 'Small' | 'Medium' | 'Large';
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
}

export function SizeFinder() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing System...");
    const [measurements, setMeasurements] = useState<Face3DMeasurements | null>(null);
    const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [telemetry, setTelemetry] = useState<Face3DMeasurements['telemetry'] | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const engineRef = useRef<FaceMeshEngine | null>(null);
    const animationRef = useRef<number>(0);
    const isScanningRef = useRef(false);
    const latestMeasurementsRef = useRef<Face3DMeasurements | null>(null);

    const getRecommendation = useCallback((m: Face3DMeasurements): SizeRecommendation => {
        const calculatedBridge = Math.round(m.bridgeWidth);
        const calculatedTemple = Math.round(m.templeLength);
        const rawLensWidth = (m.faceWidth - m.bridgeWidth) / 2 - 2;
        const calculatedLens = Math.round(rawLensWidth);

        let size: 'Small' | 'Medium' | 'Large' = 'Medium';
        if (m.faceWidth < 135) size = 'Small';
        else if (m.faceWidth > 152) size = 'Large';

        return { size, lensWidth: calculatedLens, bridgeWidth: calculatedBridge, templeLength: calculatedTemple };
    }, []);

    // ── Canvas-Based HUD Renderer ──
    const renderHUD = useCallback((m: Face3DMeasurements) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Match canvas to video display size
        const rect = video.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mirror transform to match video
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // ── object-cover compensation ──
        // MediaPipe returns normalized coords (0-1) relative to the video's
        // intrinsic resolution. CSS object-cover scales the video to fill the
        // container and crops the overflow. We must replicate that transform.
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        const cw = canvas.width;
        const ch = canvas.height;

        const videoAspect = vw / vh;
        const containerAspect = cw / ch;

        let scaleX: number, scaleY: number, offsetX: number, offsetY: number;

        if (containerAspect > videoAspect) {
            // Container is wider → video scaled by width, cropped vertically
            scaleX = cw;
            scaleY = cw / videoAspect;
            offsetX = 0;
            offsetY = (ch - scaleY) / 2;
        } else {
            // Container is taller → video scaled by height, cropped horizontally
            scaleX = ch * videoAspect;
            scaleY = ch;
            offsetX = (cw - scaleX) / 2;
            offsetY = 0;
        }

        const toPixel = (p: { x: number; y: number }) => ({
            x: p.x * scaleX + offsetX,
            y: p.y * scaleY + offsetY,
        });

        // ── Draw Face Contour ──
        if (m.faceContour.length > 2) {
            ctx.beginPath();
            const fp = toPixel(m.faceContour[0]);
            ctx.moveTo(fp.x, fp.y);
            for (let i = 1; i < m.faceContour.length; i++) {
                const p = toPixel(m.faceContour[i]);
                ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Subtle fill
            ctx.fillStyle = 'rgba(59, 130, 246, 0.03)';
            ctx.fill();
        }

        // ── Draw Iris Contours ──
        const drawIrisContour = (contour: { x: number; y: number }[], color: string) => {
            if (contour.length < 2) return;

            const center = toPixel(contour[0]); // First point is center
            const outerPoints = contour.slice(1).map(toPixel);

            if (outerPoints.length >= 3) {
                // Calculate radius from contour points
                const avgRadius = outerPoints.reduce((sum, p) => {
                    return sum + Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
                }, 0) / outerPoints.length;

                // Outer glow ring
                ctx.beginPath();
                ctx.arc(center.x, center.y, avgRadius * 1.6, 0, Math.PI * 2);
                ctx.strokeStyle = `${color}15`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Main iris ring
                ctx.beginPath();
                ctx.arc(center.x, center.y, avgRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `${color}90`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Inner pupil dot
                ctx.beginPath();
                ctx.arc(center.x, center.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Crosshair lines (subtle)
                const crossLen = avgRadius * 0.4;
                ctx.beginPath();
                ctx.moveTo(center.x - crossLen, center.y);
                ctx.lineTo(center.x + crossLen, center.y);
                ctx.moveTo(center.x, center.y - crossLen);
                ctx.lineTo(center.x, center.y + crossLen);
                ctx.strokeStyle = `${color}60`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Rotating arc (animated via frame count)
                const time = performance.now() / 1000;
                const startAngle = time * 1.5;
                ctx.beginPath();
                ctx.arc(center.x, center.y, avgRadius * 1.3, startAngle, startAngle + Math.PI * 0.6);
                ctx.strokeStyle = `${color}50`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        };

        drawIrisContour(m.irisContour.left, '#3b82f6');
        drawIrisContour(m.irisContour.right, '#3b82f6');

        // ── Draw PD Measurement Line ──
        if (m.irisLeft && m.irisRight) {
            const left = toPixel(m.irisLeft);
            const right = toPixel(m.irisRight);

            // Dashed line between pupils
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(left.x, left.y);
            ctx.lineTo(right.x, right.y);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            // PD label
            const midX = (left.x + right.x) / 2;
            const midY = (left.y + right.y) / 2 - 14;
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(`PD: ${Math.round(m.ipd)}mm`, midX, midY);
        }

        ctx.restore();
    }, []);

    const startScan = async () => {
        setIsScanning(true);
        isScanningRef.current = true;
        setScanProgress(0);
        setMeasurements(null);
        setRecommendation(null);
        setError(null);
        setIsTracking(false);
        setTelemetry(null);
        setStatusText("Configuring biometric sensors...");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                if (videoRef.current.readyState >= 1) {
                    await videoRef.current.play();
                } else {
                    await new Promise<void>((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.onloadedmetadata = async () => {
                                await videoRef.current?.play();
                                resolve();
                            };
                        }
                    });
                }
            }

            setStatusText("Initializing Neural Engine...");
            if (!engineRef.current) {
                const engine = new FaceMeshEngine();
                await engine.initialize();
                engineRef.current = engine;
            }

            engineRef.current.reset();

            let frameCount = 0;
            const requiredFrames = 72; // ~1.2s at 60fps for robust fusion

            const detect = async () => {
                if (!videoRef.current || !engineRef.current || !isScanningRef.current) return;

                try {
                    const currentMeasurements = engineRef.current.processFrame(videoRef.current, performance.now());

                    if (currentMeasurements) {
                        latestMeasurementsRef.current = currentMeasurements;
                        setTelemetry(currentMeasurements.telemetry);

                        // Render canvas HUD
                        renderHUD(currentMeasurements);

                        const { confidence } = currentMeasurements;

                        if (confidence > 0.45) {
                            setIsTracking(true);
                            frameCount++;

                            const progress = Math.min(100, (frameCount / requiredFrames) * 100);
                            setScanProgress(progress);

                            if (progress < 20) setStatusText("Calibrating iris baseline...");
                            else if (progress < 40) setStatusText("Reconstructing 3D mesh...");
                            else if (progress < 60) setStatusText("Fusing multi-frame data...");
                            else if (progress < 80) setStatusText("Correcting perspective...");
                            else setStatusText("Validating measurements...");

                            if (frameCount >= requiredFrames) {
                                setMeasurements(currentMeasurements);
                                setRecommendation(getRecommendation(currentMeasurements));

                                if (streamRef.current) {
                                    streamRef.current.getTracks().forEach(t => t.stop());
                                }
                                setIsScanning(false);
                                isScanningRef.current = false;
                                return;
                            }
                        } else {
                            setIsTracking(false);
                            const { orientation } = currentMeasurements;
                            if (Math.abs(orientation.yaw) > 15) setStatusText("Turn face to center");
                            else if (Math.abs(orientation.pitch) > 15) setStatusText("Level your gaze");
                            else if (Math.abs(orientation.roll) > 12) setStatusText("Straighten head");
                            else if (currentMeasurements.telemetry.occlusionFlags.leftEye || currentMeasurements.telemetry.occlusionFlags.rightEye)
                                setStatusText("Clear eyes from obstruction");
                            else if (currentMeasurements.telemetry.expressionActive)
                                setStatusText("Relax expression for precision");
                            else setStatusText("Adjusting — hold steady");
                        }
                    } else {
                        setIsTracking(false);
                        setStatusText("Scanning for face...");
                    }
                } catch (err) {
                    console.error("Frame error:", err);
                }

                if (isScanningRef.current) {
                    animationRef.current = requestAnimationFrame(detect);
                }
            };

            detect();

        } catch (err: any) {
            console.error('3D Size Finder error:', err);
            setError(err.message || 'Optical sensor failure');
            setIsScanning(false);
            isScanningRef.current = false;
        }
    };

    useEffect(() => {
        return () => {
            isScanningRef.current = false;
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (engineRef.current) engineRef.current.destroy();
        };
    }, []);

    const ConfidenceBar = ({ label, value }: { label: string; value: number }) => {
        const pct = Math.round(value * 100);
        const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
        const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500';
        return (
            <div className="flex items-center gap-3">
                <span className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.15em] w-16 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <span className={`text-[10px] font-black ${textColor} w-9 text-right`}>{pct}%</span>
            </div>
        );
    };

    return (
        <Card className="p-5 sm:p-8 bg-white border border-slate-200 relative overflow-hidden shadow-xl lg:shadow-2xl rounded-3xl">
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none opacity-40" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none opacity-30" />

            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[22px] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm group transition-all hover:bg-primary/10">
                    <Scan className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 leading-none mb-2">Fit Profile™ Analysis</h3>
                    <p className="text-[8px] sm:text-[10px] text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black opacity-80">3D Mesh Reconstruction Engine</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isScanning && !measurements && !error && (
                    <motion.div
                        key="initial"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-10 relative z-10"
                    >
                        <div className="space-y-6">
                            <p className="text-[15px] sm:text-[17px] text-zinc-600 leading-relaxed font-medium">
                                Clinical-grade 3D mesh reconstruction with multi-frame fusion, perspective correction, and per-metric confidence scoring. Accurate to ±0.5mm.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Eye, text: "Iris Tracking" },
                                    { icon: Brain, text: "Neural Mesh" },
                                    { icon: Shield, text: "Occlusion Guard" },
                                    { icon: Zap, text: "Real-Time Fusion" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-primary/20 hover:shadow-md group">
                                        <item.icon className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                                        <span className="text-xs text-zinc-700 font-bold tracking-wide">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            onClick={startScan}
                            className="w-full h-16 rounded-[20px] font-black text-lg bg-primary text-white hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/25"
                        >
                            Begin Fit Analysis
                        </Button>
                    </motion.div>
                )}

                {isScanning && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 relative z-10"
                    >
                        <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 shadow-inner ring-1 ring-black/5">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                                playsInline
                                muted
                            />

                            {/* Canvas HUD Overlay */}
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                            />

                            {/* Face Guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="w-[200px] h-[280px] border-2 border-primary/30 rounded-[35%] overflow-hidden relative"
                                    animate={{
                                        boxShadow: ["0 0 10px rgba(59,130,246,0.05)", "0 0 30px rgba(59,130,246,0.15)", "0 0 10px rgba(59,130,246,0.05)"],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <motion.div
                                        className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                                        animate={{ top: ["-5%", "105%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                        style={{ position: 'absolute' }}
                                    />
                                </motion.div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-200 shadow-xl flex items-center gap-2 sm:gap-3 z-30">
                                <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isTracking ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`} />
                                <p className="text-[9px] sm:text-[10px] font-black text-zinc-900 uppercase tracking-[0.12em] sm:tracking-[0.15em] whitespace-nowrap">
                                    {statusText}
                                </p>
                            </div>

                            {/* Telemetry Overlay */}
                            {telemetry && (
                                <div className="absolute top-3 left-3 z-30 bg-black/60 backdrop-blur-sm rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 space-y-0.5 sm:space-y-1">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${telemetry.calibrationMode === 'iris' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <span className="text-[7px] sm:text-[8px] text-white/80 font-bold uppercase tracking-wider">
                                            {telemetry.calibrationMode === 'iris' ? (
                                                <span className="sm:inline hidden">Iris Lock</span>
                                            ) : (
                                                <span className="sm:inline hidden">IOD Fallback</span>
                                            )}
                                            {telemetry.calibrationMode === 'iris' ? (
                                                <span className="sm:hidden inline">Iris</span>
                                            ) : (
                                                <span className="sm:hidden inline">IOD</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${telemetry.expressionActive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                        <span className="text-[7px] sm:text-[8px] text-white/80 font-bold uppercase tracking-wider">
                                            {telemetry.expressionActive ? (
                                                <span className="sm:inline hidden">Expr. Comp.</span>
                                            ) : (
                                                <span className="sm:inline hidden">Neutral</span>
                                            )}
                                            {telemetry.expressionActive ? (
                                                <span className="sm:hidden inline">Expr</span>
                                            ) : (
                                                <span className="sm:hidden inline">OK</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${(telemetry.occlusionFlags.leftEye || telemetry.occlusionFlags.rightEye || telemetry.occlusionFlags.nose)
                                            ? 'bg-red-400' : 'bg-emerald-400'
                                            }`} />
                                        <span className="text-[7px] sm:text-[8px] text-white/80 font-bold uppercase tracking-wider">
                                            {(telemetry.occlusionFlags.leftEye || telemetry.occlusionFlags.rightEye || telemetry.occlusionFlags.nose)
                                                ? (
                                                    <span className="sm:inline hidden">Occlusion</span>
                                                ) : (
                                                    <span className="sm:inline hidden">Clear Field</span>
                                                )}
                                            {(telemetry.occlusionFlags.leftEye || telemetry.occlusionFlags.rightEye || telemetry.occlusionFlags.nose)
                                                ? (
                                                    <span className="sm:hidden inline">OCCL</span>
                                                ) : (
                                                    <span className="sm:hidden inline">Clear</span>
                                                )}
                                        </span>
                                    </div>
                                    <span className="text-[6px] sm:text-[7px] text-white/40 font-mono block transition-opacity sm:opacity-100 opacity-60">{telemetry.frameProcessingMs.toFixed(0)}ms</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Multi-Frame Fusion</span>
                                <span className="text-primary font-black text-xl leading-none">{Math.round(scanProgress)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {measurements && recommendation && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 relative z-10"
                    >
                        {/* Result Main Card */}
                        <div className="bg-gradient-to-br from-primary/[0.04] to-transparent rounded-[32px] p-8 border border-primary/10 relative overflow-hidden group shadow-lg">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                <CheckCircle2 className="w-40 h-40 text-primary" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Profile Validated</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                        <p className="text-[9px] text-primary font-black uppercase tracking-wider">
                                            {measurements.telemetry.calibrationMode === 'iris' ? 'Iris Calibrated' : 'IOD Calibrated'}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-zinc-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2">Optimal Fit Selection</p>
                                <h4 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tighter mb-6">{recommendation.size} Size</h4>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`w-5 h-2 rounded-full transition-all duration-500 ${i <= (measurements.confidence * 5) ? 'bg-primary shadow-sm' : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                                        Overall: {Math.round(measurements.confidence * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Measurement Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                            {[
                                { label: "PD", val: measurements.ipd, unit: "mm", conf: measurements.confidenceBreakdown.pd },
                                { label: "Width", val: measurements.faceWidth, unit: "mm", conf: measurements.confidenceBreakdown.faceWidth },
                                { label: "Bridge", val: measurements.bridgeWidth, unit: "mm", conf: measurements.confidenceBreakdown.bridge },
                                { label: "Temple", val: measurements.templeLength, unit: "mm", conf: measurements.confidenceBreakdown.temple }
                            ].map((m, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                                    <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase font-black tracking-[0.1em] sm:tracking-[0.15em] mb-1 sm:mb-2 group-hover:text-primary transition-colors">{m.label}</p>
                                    <p className="text-xl sm:text-2xl font-black text-zinc-900 leading-none mb-1 sm:mb-2">{Math.round(m.val)}<span className="text-[9px] sm:text-[10px] text-zinc-400 font-black ml-0.5">mm</span></p>
                                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden mt-1 sm:mt-2">
                                        <motion.div
                                            className={`h-full rounded-full ${m.conf >= 0.8 ? 'bg-emerald-500' : m.conf >= 0.6 ? 'bg-amber-500' : 'bg-red-400'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.conf * 100}%` }}
                                        />
                                    </div>
                                    <p className={`text-[7px] sm:text-[8px] font-bold mt-1 ${m.conf >= 0.8 ? 'text-emerald-500' : m.conf >= 0.6 ? 'text-amber-500' : 'text-red-400'}`}>
                                        {Math.round(m.conf * 100)}%
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Per-Metric Confidence Breakdown */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2.5">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Confidence Breakdown</p>
                            <ConfidenceBar label="PD" value={measurements.confidenceBreakdown.pd} />
                            <ConfidenceBar label="Width" value={measurements.confidenceBreakdown.faceWidth} />
                            <ConfidenceBar label="Bridge" value={measurements.confidenceBreakdown.bridge} />
                            <ConfidenceBar label="Temple" value={measurements.confidenceBreakdown.temple} />
                            <ConfidenceBar label="Nose" value={measurements.confidenceBreakdown.noseDepth} />
                        </div>

                        {/* Spec Box */}
                        <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <p className="text-[9px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Personalized Frame Architecture™</p>
                                    <div className={`text-[8px] sm:text-[10px] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${measurements.noseShape === 'High' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        {measurements.noseShape} Profile
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-0 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="text-center p-4 sm:p-6 border-r border-slate-100">
                                        <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase font-black tracking-widest mb-1 sm:mb-2">Lens</p>
                                        <p className="text-xl sm:text-2xl font-black text-zinc-900 leading-none">{recommendation.lensWidth}<span className="text-[9px] sm:text-[10px] ml-0.5">mm</span></p>
                                    </div>
                                    <div className="text-center p-4 sm:p-6 border-r border-slate-100">
                                        <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase font-black tracking-widest mb-1 sm:mb-2">Bridge</p>
                                        <p className="text-xl sm:text-2xl font-black text-zinc-900 leading-none">{recommendation.bridgeWidth}<span className="text-[9px] sm:text-[10px] ml-0.5">mm</span></p>
                                    </div>
                                    <div className="text-center p-4 sm:p-6">
                                        <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase font-black tracking-widest mb-1 sm:mb-2">Temple</p>
                                        <p className="text-xl sm:text-2xl font-black text-zinc-900 leading-none">{recommendation.templeLength}<span className="text-[9px] sm:text-[10px] ml-0.5">mm</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { setMeasurements(null); setRecommendation(null); setTelemetry(null); }}
                                className="flex-1 h-16 rounded-2xl border border-slate-200 text-zinc-600 hover:bg-slate-50 font-black text-base transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <RefreshCcw className="w-5 h-5" /> Retake
                            </button>
                            <Button
                                className="flex-1 h-16 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                            >
                                Apply Fit Profile
                            </Button>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 relative z-10"
                    >
                        <div className="w-24 h-24 bg-red-500/10 rounded-[35px] flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-sm">
                            <Camera className="w-12 h-12 text-red-500" />
                        </div>
                        <h4 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">Sensor Link Failed</h4>
                        <p className="text-zinc-500 text-base mb-12 max-w-[300px] mx-auto leading-relaxed font-bold">{error}</p>
                        <Button onClick={startScan} className="h-16 px-12 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <RefreshCcw className="w-5 h-5 mr-3" /> Restart System Link
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
