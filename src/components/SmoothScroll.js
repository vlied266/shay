import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const lenisRef = { current: null };
let lenisInstance = null;
export function getLenisInstance() {
    return lenisInstance;
}
export default function SmoothScroll({ children }) {
    const rafRef = useRef(null);
    const location = useLocation();
    const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;
    useEffect(() => {
        if (prefersReducedMotion) {
            return;
        }
        // Clean up existing instance
        if (lenisRef.current) {
            lenisRef.current.destroy();
            lenisRef.current = null;
        }
        // Create new Lenis instance
        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 1.2,
            touchMultiplier: 1,
            smoothWheel: true,
            syncTouch: true,
        });
        lenisRef.current = lenis;
        lenisInstance = lenis;
        // Connect to GSAP ticker
        const update = (time) => {
            lenis.raf(time);
            ScrollTrigger.update();
        };
        gsap.ticker.add(update);
        return () => {
            gsap.ticker.remove(update);
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
                lenisInstance = null;
            }
        };
    }, [prefersReducedMotion]);
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [location]);
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);
    return _jsx(_Fragment, { children: children });
}
