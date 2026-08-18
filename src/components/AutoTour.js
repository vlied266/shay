import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { getLenisInstance } from './SmoothScroll';
import './AutoTour.css';
export default function AutoTour({ documentHeight }) {
    const [state, setState] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [showRestart, setShowRestart] = useState(false);
    const tweenRef = useRef(null);
    const progressRef = useRef(0);
    const TOUR_DURATION_1X = 20;
    const tourDuration = TOUR_DURATION_1X / speed;
    const handleStart = () => {
        setState('running');
        setShowRestart(false);
        progressRef.current = 0;
        setProgress(0);
        const lenis = getLenisInstance();
        if (!lenis)
            return;
        if (tweenRef.current)
            tweenRef.current.kill();
        tweenRef.current = gsap.to(progressRef, {
            current: 1,
            duration: tourDuration,
            ease: 'none',
            onUpdate: () => {
                const newProgress = progressRef.current;
                setProgress(newProgress);
                if (newProgress > 0.02) {
                    setShowRestart(true);
                }
                lenis.scrollTo(newProgress * (documentHeight - window.innerHeight), {
                    immediate: true,
                });
            },
            onComplete: () => {
                setState('completed');
                setShowRestart(true);
            },
        });
    };
    const handlePause = () => {
        if (tweenRef.current) {
            tweenRef.current.pause();
        }
        setState('paused');
    };
    const handleResume = () => {
        if (tweenRef.current) {
            tweenRef.current.resume();
        }
        setState('running');
    };
    const handleRestart = () => {
        if (tweenRef.current)
            tweenRef.current.kill();
        setShowRestart(false);
        setProgress(0);
        progressRef.current = 0;
        setState('idle');
    };
    const handleReplay = () => {
        handleStart();
    };
    const handleWheel = () => {
        if (state === 'running') {
            handlePause();
        }
    };
    const handleTouchStart = () => {
        if (state === 'running') {
            handlePause();
        }
    };
    const handleKeyDown = (evt) => {
        if (state === 'running') {
            if (evt.key === 'PageUp' || evt.key === 'PageDown' ||
                evt.key === 'Home' || evt.key === 'End' ||
                evt.key === ' ' ||
                evt.key === 'ArrowUp' || evt.key === 'ArrowDown' ||
                evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
                handlePause();
            }
            if (evt.key === 'Escape') {
                handlePause();
            }
        }
    };
    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [state]);
    useEffect(() => {
        return () => {
            if (tweenRef.current)
                tweenRef.current.kill();
        };
    }, []);
    const statusText = state === 'idle' ? 'Start Tour' :
        state === 'running' ? 'Pause' :
            state === 'paused' ? 'Resume' :
                'Replay';
    const progressPercent = Math.round(progress * 100);
    return (_jsx("div", { className: "auto-tour", children: _jsxs("div", { className: "auto-tour-control", role: "group", "aria-label": "Auto tour controls", children: [_jsxs("button", { onClick: state === 'idle' ? handleStart : state === 'running' ? handlePause : state === 'paused' ? handleResume : handleReplay, className: "tour-btn tour-btn-primary", "aria-pressed": state === 'running', "aria-label": statusText, children: [state === 'running' ? (_jsx(Pause, { size: 16 })) : (_jsx(Play, { size: 16 })), _jsx("span", { children: statusText })] }), showRestart && (_jsx("button", { onClick: handleRestart, className: "tour-btn tour-btn-secondary", "aria-label": "Restart tour", children: _jsx(RotateCcw, { size: 14 }) })), _jsxs("button", { onClick: () => setSpeed(speed === 1 ? 2 : 1), className: "tour-btn tour-btn-speed", "aria-label": `Tour speed: ${speed}x`, children: [speed, "\u00D7"] }), _jsxs("div", { className: "tour-progress", "aria-live": "polite", "aria-label": `Tour progress: ${progressPercent}%`, children: [progressPercent, "%"] })] }) }));
}
