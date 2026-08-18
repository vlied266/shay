import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollVideo from '../components/ScrollVideo';
import AutoTour from '../components/AutoTour';
import './Experience.css';
gsap.registerPlugin(ScrollTrigger);
const CHAPTERS = [
    {
        id: 'vision',
        startProgress: 0,
        endProgress: 0.15,
        title: 'VISION',
        subtitle: 'One Creative Journey',
        description: 'Where reflection becomes reality. An eye as the window to infinite creative possibility.'
    },
    {
        id: 'form',
        startProgress: 0.15,
        endProgress: 0.35,
        title: 'FORM',
        subtitle: 'Beauty & Skincare',
        description: 'From concept to presence. The evolution of form, beauty refined through authentic representation.'
    },
    {
        id: 'vitality',
        startProgress: 0.35,
        endProgress: 0.55,
        title: 'VITALITY',
        subtitle: 'Health & Medical',
        description: 'Wellness visualized. The integration of health, science, and human beauty in premium visual language.'
    },
    {
        id: 'architecture',
        startProgress: 0.55,
        endProgress: 0.8,
        title: 'ARCHITECTURE',
        subtitle: 'Real Estate & Design',
        description: 'Space becomes story. Premium contemporary living shaped by refined design principles.'
    },
    {
        id: 'living',
        startProgress: 0.8,
        endProgress: 0.95,
        title: 'LIVING',
        subtitle: 'Lifestyle & Editorial',
        description: 'Where design meets daily life. The warmth of premium living, authentically rendered.'
    },
];
export default function Experience() {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [documentHeight, setDocumentHeight] = useState(0);
    useEffect(() => {
        const updateHeight = () => {
            if (contentRef.current) {
                setDocumentHeight(contentRef.current.scrollHeight);
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);
    useGSAP(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.to('.hero-title', {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'center center',
                    scrub: 0.5,
                },
                opacity: 0,
                y: -50,
                duration: 1,
            });
            // Credit section fade in
            gsap.fromTo('.credit-section', {
                opacity: 0,
                y: 50,
            }, {
                scrollTrigger: {
                    trigger: '.credit-section',
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 0.5,
                },
                opacity: 1,
                y: 0,
            });
            // Chapter text animations - use onUpdate on ScrollTrigger directly
            const scrollProgress = ScrollTrigger.create({
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    const progress = self.progress;
                    CHAPTERS.forEach((chapter) => {
                        if (progress >= chapter.startProgress && progress <= chapter.endProgress) {
                            const chapterProgress = (progress - chapter.startProgress) / (chapter.endProgress - chapter.startProgress);
                            gsap.set(`[data-chapter="${chapter.id}"]`, {
                                opacity: Math.min(chapterProgress * 2, 1),
                                y: Math.max(50 * (1 - chapterProgress), 0),
                            });
                        }
                        else if (progress < chapter.startProgress) {
                            gsap.set(`[data-chapter="${chapter.id}"]`, {
                                opacity: 0,
                                y: 50,
                            });
                        }
                        else {
                            gsap.set(`[data-chapter="${chapter.id}"]`, {
                                opacity: 0,
                                y: -50,
                            });
                        }
                    });
                }
            });
            return () => {
                scrollProgress.kill();
            };
        }, containerRef);
        return () => ctx.revert();
    }, { scope: containerRef });
    return (_jsxs("div", { ref: containerRef, className: "experience-root", children: [_jsx(ScrollVideo, { src: "/media/hero.mp4" }), _jsxs("div", { ref: contentRef, className: "experience-content", children: [_jsx("section", { className: "hero-section", children: _jsx("div", { className: "hero-content", children: _jsxs("div", { className: "hero-title", children: [_jsx("h1", { children: "SHAY KAY" }), _jsx("p", { className: "hero-subtitle", children: "Creative Direction \u00B7 Visual Design \u00B7 Film" })] }) }) }), _jsx("section", { className: "chapters-section", children: CHAPTERS.map((chapter) => (_jsxs("div", { className: "chapter-block", "data-chapter": chapter.id, children: [_jsxs("div", { className: "chapter-header", children: [_jsx("h2", { children: chapter.title }), _jsx("p", { className: "chapter-subtitle", children: chapter.subtitle })] }), _jsx("p", { className: "chapter-description", children: chapter.description }), _jsxs("div", { className: "chapter-progress", children: [_jsx("div", { className: "progress-line" }), _jsxs("span", { className: "progress-text", children: [Math.round(chapter.startProgress * 100), "%"] })] })] }, chapter.id))) }), _jsx("section", { className: "credit-section", children: _jsxs("div", { className: "credit-content", children: [_jsx("h2", { children: "Premium Creative Direction" }), _jsx("p", { children: "For over a decade, we've shaped visual narratives across beauty, healthcare, real estate, and lifestyle. Each project reflects our commitment to refined aesthetics, strategic thinking, and authentic storytelling." }), _jsxs("div", { className: "service-list", children: [_jsxs("div", { className: "service-item", children: [_jsx("h3", { children: "Creative Direction" }), _jsx("p", { children: "Strategic visual storytelling from concept to final delivery" })] }), _jsxs("div", { className: "service-item", children: [_jsx("h3", { children: "Visual Design" }), _jsx("p", { children: "Editorial-grade design systems and premium visual identity" })] }), _jsxs("div", { className: "service-item", children: [_jsx("h3", { children: "Film & Motion" }), _jsx("p", { children: "Cinematic production and motion design for commercial work" })] })] }), _jsxs("div", { className: "cta-section", children: [_jsx("p", { className: "cta-subtitle", children: "Ready to create something exceptional?" }), _jsx("a", { href: "mailto:hello@shaykay.studio", className: "cta-button", children: "Get in touch" })] }), _jsx("div", { className: "prompt-link", children: _jsx(Link, { to: "/prompt", children: "View reconstruction prompt \u2192" }) })] }) }), _jsx("div", { className: "scroll-spacer" })] }), documentHeight > 0 && _jsx(AutoTour, { documentHeight: documentHeight })] }));
}
