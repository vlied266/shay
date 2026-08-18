import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollVideo from '../components/ScrollVideo'
import AutoTour from '../components/AutoTour'
import './Experience.css'

gsap.registerPlugin(ScrollTrigger)

interface ChapterData {
  id: string
  startProgress: number
  endProgress: number
  title: string
  subtitle: string
  description: string
}

const CHAPTERS: ChapterData[] = [
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
]

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [documentHeight, setDocumentHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setDocumentHeight(contentRef.current.scrollHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

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
      })

      // Credit section
      gsap.to('.credit-section', {
        scrollTrigger: {
          trigger: '.credit-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
        opacity: 1,
        y: 0,
      })

      // Chapter text animations
      CHAPTERS.forEach((chapter) => {
        gsap.to(`[data-chapter="${chapter.id}"]`, {
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              const progress = self.progress
              if (progress >= chapter.startProgress && progress <= chapter.endProgress) {
                const chapterProgress = (progress - chapter.startProgress) / (chapter.endProgress - chapter.startProgress)
                gsap.set(`[data-chapter="${chapter.id}"]`, {
                  opacity: Math.min(chapterProgress * 2, 1),
                  y: Math.max(50 * (1 - chapterProgress), 0),
                })
              } else {
                gsap.set(`[data-chapter="${chapter.id}"]`, {
                  opacity: 0,
                  y: 50,
                })
              }
            }
          }
        })
      })

      // Update active chapter
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom'
      })
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="experience-root">
      <ScrollVideo
        src="/media/hero.mp4"
      />

      <div ref={contentRef} className="experience-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-title">
              <h1>SHAY KAY</h1>
              <p className="hero-subtitle">Creative Direction · Visual Design · Film</p>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <section className="chapters-section">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.id}
              className="chapter-block"
              data-chapter={chapter.id}
            >
              <div className="chapter-header">
                <h2>{chapter.title}</h2>
                <p className="chapter-subtitle">{chapter.subtitle}</p>
              </div>
              <p className="chapter-description">{chapter.description}</p>

              {/* Progress indicator */}
              <div className="chapter-progress">
                <div className="progress-line" />
                <span className="progress-text">{Math.round(chapter.startProgress * 100)}%</span>
              </div>
            </div>
          ))}
        </section>

        {/* Credit/CTA Section */}
        <section className="credit-section">
          <div className="credit-content">
            <h2>Premium Creative Direction</h2>
            <p>
              For over a decade, we've shaped visual narratives across beauty, healthcare, real estate, and lifestyle.
              Each project reflects our commitment to refined aesthetics, strategic thinking, and authentic storytelling.
            </p>

            <div className="service-list">
              <div className="service-item">
                <h3>Creative Direction</h3>
                <p>Strategic visual storytelling from concept to final delivery</p>
              </div>
              <div className="service-item">
                <h3>Visual Design</h3>
                <p>Editorial-grade design systems and premium visual identity</p>
              </div>
              <div className="service-item">
                <h3>Film & Motion</h3>
                <p>Cinematic production and motion design for commercial work</p>
              </div>
            </div>

            <div className="cta-section">
              <p className="cta-subtitle">Ready to create something exceptional?</p>
              <a href="mailto:hello@shaykay.studio" className="cta-button">
                Get in touch
              </a>
            </div>

            <div className="prompt-link">
              <Link to="/prompt">View reconstruction prompt →</Link>
            </div>
          </div>
        </section>

        {/* Spacer for scroll */}
        <div className="scroll-spacer" />
      </div>

      {/* Auto Tour */}
      {documentHeight > 0 && <AutoTour documentHeight={documentHeight} />}
    </div>
  )
}
