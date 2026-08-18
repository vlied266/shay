import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function ScrollVideo({ src, onDurationChange, onProgress }) {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const handleLoadedMetadata = () => {
            setIsLoading(false);
            onDurationChange?.(video.duration);
            console.log('Video loaded:', video.duration);
        };
        const handlePlay = (e) => {
            e.preventDefault();
            e.target.pause();
        };
        const handleError = (e) => {
            console.error('Video error:', e);
            setHasError(true);
            setIsLoading(false);
        };
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('play', handlePlay);
        video.addEventListener('error', handleError);
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('error', handleError);
        };
    }, [onDurationChange, onProgress]);
    useGSAP(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const trigger = ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                if (video.duration) {
                    const targetTime = video.duration * self.progress;
                    video.currentTime = targetTime;
                    onProgress?.(self.progress);
                }
            }
        });
        return () => {
            trigger.kill();
        };
    }, { scope: videoRef });
    return (_jsxs("div", { className: "fixed inset-0 w-full h-full overflow-hidden bg-black", children: [isLoading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/80 z-50", children: _jsx("div", { className: "w-12 h-12 border-2 border-gray-400 border-t-white rounded-full animate-spin" }) })), hasError && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/90 z-50", children: _jsx("p", { className: "text-white text-sm", children: "Unable to load video" }) })), _jsx("video", { ref: videoRef, className: "absolute inset-0 w-full h-full object-cover", src: src, muted: true, playsInline: true, preload: "auto", disablePictureInPicture: true })] }));
}
